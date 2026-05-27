import { PrismaClient } from '@prisma/client';
import { generateResponse } from '../services/aiService.js';

const prisma = new PrismaClient();

// Вспомогательная функция для получения или создания питомца
export async function getOrCreatePetData(userId) {
  let pet = await prisma.pet.findUnique({ where: { userId } });
  
  if (!pet) {
    pet = await prisma.pet.create({
      data: {
        userId,
        type: 'cat',
        color: '#FFFFFF',
        accessories: [],
        mood: 'happy',
        hunger: 50,      // Добавлено
        energy: 100,     // Добавлено
        experience: 0,
        level: 1
      }
    });
  }
  return pet;
}

// Получить питомца
export async function getPetByUserId(userId) {
  return prisma.pet.findUnique({ where: { userId } });
}

// Создать питомца
export async function createPet(userId) {
  return prisma.pet.create({
    data: {
      userId,
      type: 'cat',
      color: '#FFFFFF',
      accessories: [],
      mood: 'happy',
      hunger: 50,      // Добавлено
      energy: 100,     // Добавлено
      experience: 0,
      level: 1
    }
  });
}

// Обновить внешность
export async function updatePetAppearance(userId, updates) {
  return prisma.pet.update({
    where: { userId },
    data: {
      ...updates,
      accessories: Array.isArray(updates.accessories) ? updates.accessories : []
    }
  });
}

// Обновить статы (настроение, опыт, голод, энергия)
export async function updatePetStats(userId, stats) {
  const pet = await prisma.pet.findUnique({ where: { userId } });
  if (!pet) throw new Error('Питомец не найден');

  // Логика опыта и уровня
  let newExperience = pet.experience + (stats.experience || 0);
  let newLevel = pet.level;
  
  if (newExperience >= newLevel * 100) {
    newLevel += Math.floor(newExperience / (newLevel * 100));
  }

  // Подготовка данных для обновления
  const updateData = {
    mood: stats.mood !== undefined ? stats.mood : pet.mood,
    experience: newExperience,
    level: newLevel
  };

  // Добавляем голод и энергию, если они переданы
  if (stats.hunger !== undefined) {
    // Ограничиваем значения от 0 до 100
    updateData.hunger = Math.max(0, Math.min(100, stats.hunger));
  }
  if (stats.energy !== undefined) {
    updateData.energy = Math.max(0, Math.min(100, stats.energy));
  }

  return prisma.pet.update({
    where: { userId },
    data: updateData
  });
}

// Создание записи взаимодействия
export async function createInteraction(petId, type, input, output) {
  return prisma.interaction.create({
    data: {
      petId,
      type,
      userInput: input,
      aiResponse: typeof output === 'object' ? JSON.stringify(output) : output
    }
  });
}

// --- ОСНОВНЫЕ ХЕНДЛЕРЫ ДЛЯ МАРШРУТОВ ---

export async function getOrCreatePet(req, res) {
  try {
    const { userId } = req.params;
    const pet = await getOrCreatePetData(userId);
    
    res.json({ success: true, data: pet });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function customizePet(req, res) {
  try {
    const { userId } = req.params;
    const { type, color, accessories } = req.body;
    
    const updatedPet = await updatePetAppearance(userId, { type, color, accessories });
    
    res.json({ success: true, message: 'Внешность обновлена!', data: updatedPet });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function updatePetMood(req, res) {
  try {
    const { userId } = req.params;
    const { mood, experience, hunger, energy } = req.body;
    
    // Теперь можно передать hunger и energy с фронтенда
    const updatedPet = await updatePetStats(userId, { mood, experience, hunger, energy });
    
    res.json({ success: true, message: 'Состояние обновлено!', data: updatedPet });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
}

// Пересказ статьи через Groq
export async function summarizeArticle(req, res) {
  try {
    const { userId } = req.params;
    const { text, url } = req.body;

    if (!text) return res.status(400).json({ success: false, message: 'Текст не предоставлен' });

    const pet = await getOrCreatePetData(userId);

    // Добавляем состояние в промпт
    const systemPrompt = `Ты дружелюбный браузерный питомец (${pet.type}). 
    Твое текущее состояние: Настроение - ${pet.mood}, Голод - ${pet.hunger}/100, Энергия - ${pet.energy}/100.
    Если голод > 80, жалуйся на еду. Если энергия < 20, говори, что устаешь.
    Твоя задача — кратко и интересно пересказать суть текста пользователю. Используй эмодзи. Не пиши больше 3 абзацев.`;
    
    const aiResponse = await generateResponse(systemPrompt, `Перескажи этот текст: ${text}`);

    await createInteraction(pet.id, 'summary', text.substring(0, 500), aiResponse);
    // Уменьшаем энергию при работе
    await updatePetStats(userId, { experience: 15, energy: -5 });

    res.json({ success: true, data: { summary: aiResponse, pet: await getOrCreatePetData(userId) } });
  } catch (error) {
    console.error('Ошибка пересказа:', error);
    res.status(500).json({ success: false, message: 'Ошибка ИИ или сервера', error: error.message });
  }
}

// Вопрос по странице через Groq
export async function askQuestion(req, res) {
  try {
    const { userId } = req.params;
    const { question, pageContent } = req.body;

    if (!question || !pageContent) return res.status(400).json({ success: false, message: 'Нет вопроса или контента' });

    const pet = await getOrCreatePetData(userId);

    const systemPrompt = `Ты умный питомец. Твое состояние: Голод ${pet.hunger}, Энергия ${pet.energy}.
    Ответь на вопрос пользователя, основываясь ТОЛЬКО на предоставленном тексте страницы. 
    Если ответа нет, скажи об этом мило. Если ты очень голоден или устал, упомяни это вскользь в начале или конце.`;
    
    const userPrompt = `Контекст страницы: ${pageContent}\n\nВопрос пользователя: ${question}`;
    
    const aiResponse = await generateResponse(systemPrompt, userPrompt);

    await createInteraction(pet.id, 'qa', question, aiResponse);
    await updatePetStats(userId, { experience: 20, energy: -5 });

    res.json({ success: true, data: { answer: aiResponse, pet: await getOrCreatePetData(userId) } });
  } catch (error) {
    console.error('Ошибка Q&A:', error);
    res.status(500).json({ success: false, message: 'Ошибка ИИ или сервера', error: error.message });
  }
}

// Чат с питомцем через Groq
export async function chatWithPet(req, res) {
  try {
    const { userId } = req.params;
    const { message } = req.body;

    if (!message) return res.status(400).json({ success: false, message: 'Сообщение пустое' });

    const pet = await getOrCreatePetData(userId);

    const systemPrompt = `Ты виртуальный питомец типа ${pet.type}. 
    Твои характеристики:
    - Настроение: ${pet.mood}
    - Голод: ${pet.hunger} из 100 (если > 80, ты очень хочешь есть)
    - Энергия: ${pet.energy} из 100 (если < 20, ты сильно устал)
    
    Общайся коротко, мило и с характером. Используй эмодзи. 
    Твои ответы должны зависеть от твоего состояния (например, если голоден, проси еды; если устал — ложиться спать).`;

    const aiResponse = await generateResponse(systemPrompt, message);

    await createInteraction(pet.id, 'chat', message, aiResponse);
    // Небольшой расход энергии при общении
    await updatePetStats(userId, { experience: 5, energy: -2 });

    res.json({ success: true, data: { response: aiResponse, pet: await getOrCreatePetData(userId) } });
  } catch (error) {
    console.error('Ошибка чата:', error);
    res.status(500).json({ success: false, message: 'Ошибка ИИ или сервера', error: error.message });
  }
}