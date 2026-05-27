import { Router } from 'express'
import {
  getOrCreatePet,
  customizePet,
  updatePetMood,
  summarizeArticle,
  askQuestion,
  chatWithPet
} from './petRoutes.js'

const router = Router()

// === Маршруты для работы с питомцем ===

// Получить или создать питомца
// GET /api/pet/:userId
router.get('/pet/:userId', getOrCreatePet)

// Обновить внешность питомца
// PUT /api/pet/:userId/customize
router.put('/pet/:userId/customize', customizePet)

// Обновить настроение/опыт питомца
// PATCH /api/pet/:userId/mood
router.patch('/pet/:userId/mood', updatePetMood)

// === Маршруты для ИИ-функций ===

// Пересказать статью
// POST /api/pet/:userId/summarize
router.post('/pet/:userId/summarize', summarizeArticle)

// Задать вопрос по странице
// POST /api/pet/:userId/ask
router.post('/pet/:userId/ask', askQuestion)

// Поболтать с питомцем
// POST /api/pet/:userId/chat
router.post('/pet/:userId/chat', chatWithPet)

export default router
