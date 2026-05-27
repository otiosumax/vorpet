import { 
  getPetByUserId, 
  createPet, 
  updatePetAppearance, 
  updatePetStats,
  createInteraction 
} from '../controllers/petController.js';

// Импортируем сервис для работы с ИИ
import { generateResponse } from '../services/aiService.js';

// Получить или создать питомца для пользователя
export async function getOrCreatePet(req, res) {
  try {
    const { userId } = req.params
    
    let pet = await getPetByUserId(userId)
    
    if (!pet) {
      pet = await createPet(userId)
      return res.status(201).json({
        success: true,
        message: 'Питомец создан!',
        data: pet
      })
    }
    
    res.json({
      success: true,
      data: pet
    })
  } catch (error) {
    console.error('Ошибка получения питомца:', error)
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при получении питомца',
      error: error.message
    })
  }
}

// Обновить внешность питомца
export async function customizePet(req, res) {
  try {
    const { userId } = req.params
    const { type, color, accessories } = req.body
    
    const updatedPet = await updatePetAppearance(userId, {
      type,
      color,
      accessories
    })
    
    res.json({
      success: true,
      message: 'Внешность питомца обновлена!',
      data: updatedPet
    })
  } catch (error) {
    console.error('Ошибка обновления внешности:', error)
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при обновлении внешности',
      error: error.message
    })
  }
}

// Обновить настроение/опыт питомца
export async function updatePetMood(req, res) {
  try {
    const { userId } = req.params
    const { mood, experience } = req.body
    
    const updatedPet = await updatePetStats(userId, {
      mood,
      experience
    })
    
    res.json({
      success: true,
      message: 'Состояние питомца обновлено!',
      data: updatedPet
    })
  } catch (error) {
    console.error('Ошибка обновления состояния:', error)
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при обновлении состояния',
      error: error.message
    })
  }
}

// Запрос на пересказ статьи (с использованием ИИ)
export async function summarizeArticle(req, res) {
  try {
    const { userId } = req.params
    const { text, url } = req.body
    
    const pet = await getPetByUserId(userId)
    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Питомец не найден'
      })
    }

    // Вызываем ИИ для пересказа
    const summary = await generateResponse(text, 'summarize');
    
    // Сохраняем взаимодействие
    await createInteraction(pet.id, 'summary', text, { url, summary });
    
    // Добавляем опыт
    await updatePetStats(userId, { experience: 10 });
    
    res.json({
      success: true,
      data: {
        summary,
        pet: await getPetByUserId(userId)
      }
    })
  } catch (error) {
    console.error('Ошибка пересказа:', error)
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при пересказе статьи',
      error: error.message
    })
  }
}

// Вопрос-ответ по странице (с использованием ИИ)
export async function askQuestion(req, res) {
  try {
    const { userId } = req.params
    const { question, pageContent } = req.body
    
    const pet = await getPetByUserId(userId)
    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Питомец не найден'
      })
    }

    // Вызываем ИИ для ответа на вопрос
    const answer = await generateResponse(pageContent, 'qa', question);
    
    // Сохраняем взаимодействие
    await createInteraction(pet.id, 'qa', question, { pageContent, answer });
    
    // Добавляем опыт
    await updatePetStats(userId, { experience: 15 });
    
    res.json({
      success: true,
      data: {
        question,
        answer,
        pet: await getPetByUserId(userId)
      }
    })
  } catch (error) {
    console.error('Ошибка ответа на вопрос:', error)
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при ответе на вопрос',
      error: error.message
    })
  }
}

// Чат с питомцем (с использованием ИИ)
export async function chatWithPet(req, res) {
  try {
    const { userId } = req.params
    const { message } = req.body
    
    const pet = await getPetByUserId(userId)
    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Питомец не найден'
      })
    }

    // Вызываем ИИ для генерации ответа в стиле питомца
    const responseText = await generateResponse(message, 'chat');
    
    // Сохраняем взаимодействие
    await createInteraction(pet.id, 'chat', message, responseText);
    
    // Добавляем небольшой опыт за общение
    await updatePetStats(userId, { experience: 5 });
    
    res.json({
      success: true,
      data: {
        message,
        response: responseText,
        pet: await getPetByUserId(userId)
      }
    })
  } catch (error) {
    console.error('Ошибка чата:', error)
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при чате',
      error: error.message
    })
  }
}