import { 
  getPetByUserId, 
  createPet, 
  updatePetAppearance, 
  updatePetStats,
  createInteraction 
} from '../controllers/petController.js'

// Получить или создать питомца для пользователя
export async function getOrCreatePet(req, res) {
  try {
    const { userId } = req.params
    
    // Проверяем, есть ли уже питомец
    let pet = await getPetByUserId(userId)
    
    // Если питомца нет, создаем нового
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

// Запрос на пересказ статьи (с сохранением в историю)
export async function summarizeArticle(req, res) {
  try {
    const { userId } = req.params
    const { text, url } = req.body
    
    // Получаем питомца
    const pet = await getPetByUserId(userId)
    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Питомец не найден'
      })
    }
    
    // Здесь будет логика вызова ИИ для пересказа
    // Пока возвращаем заглушку
    const summary = "Это пример пересказа статьи. В реальной версии здесь будет ответ от ИИ."
    
    // Сохраняем взаимодействие в базу
    await createInteraction(pet.id, 'summary', text, { url, summary })
    
    // Добавляем опыт питомцу
    await updatePetStats(userId, { experience: 10 })
    
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

// Вопрос-ответ по странице (с сохранением в историю)
export async function askQuestion(req, res) {
  try {
    const { userId } = req.params
    const { question, pageContent } = req.body
    
    // Получаем питомца
    const pet = await getPetByUserId(userId)
    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Питомец не найден'
      })
    }
    
    // Здесь будет логика вызова ИИ для ответа на вопрос
    // Пока возвращаем заглушку
    const answer = "Это пример ответа на вопрос. В реальной версии здесь будет ответ от ИИ на основе содержимого страницы."
    
    // Сохраняем взаимодействие в базу
    await createInteraction(pet.id, 'qa', question, { pageContent, answer })
    
    // Добавляем опыт питомцу
    await updatePetStats(userId, { experience: 15 })
    
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

// Просто поболтать с питомцем
export async function chatWithPet(req, res) {
  try {
    const { userId } = req.params
    const { message } = req.body
    
    // Получаем питомца
    const pet = await getPetByUserId(userId)
    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Питомец не найден'
      })
    }
    
    // Здесь будет логика вызова ИИ для чата
    // Пока возвращаем заглушку с учетом настроения питомца
    const responses = {
      happy: `Я сейчас в отличном настроении! 😊 ${message}`,
      sad: `Мне немного грустно... но я постараюсь ответить. ${message}`,
      excited: `Ура! Я так рад общению! 🎉 ${message}`,
      tired: `Я устал... давай покороче. ${message}`
    }
    
    const response = responses[pet.mood] || `${message}`
    
    // Сохраняем взаимодействие в базу
    await createInteraction(pet.id, 'chat', message, { response })
    
    res.json({
      success: true,
      data: {
        message,
        response,
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
