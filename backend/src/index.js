import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDB, disconnectDB } from './config/database.js'
import routes from './routes/index.js'

// Загружаем переменные окружения из файла .env
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// === Middleware ===

// Разрешаем CORS для запросов от браузерного расширения
app.use(cors({
  origin: '*', // В продакшене лучше указать конкретные домены
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// Парсим JSON из тела запроса
app.use(express.json())

// Парсим URL-encoded данные
app.use(express.urlencoded({ extended: true }))

// Логгер для отладки (можно убрать в продакшене)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  next()
})

// === Маршруты ===
app.use('/api', routes)

// Приветственный эндпоинт для проверки работы сервера
app.get('/', (req, res) => {
  res.json({
    message: '🐾 AI Pet Backend работает!',
    version: '1.0.0',
    endpoints: {
      pet: '/api/pet/:userId',
      customize: '/api/pet/:userId/customize',
      summarize: '/api/pet/:userId/summarize',
      ask: '/api/pet/:userId/ask',
      chat: '/api/pet/:userId/chat'
    }
  })
})

// Обработка несуществующих маршрутов
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Маршрут не найден'
  })
})

// Глобальная обработка ошибок
app.use((err, req, res, next) => {
  console.error('Глобальная ошибка:', err)
  res.status(500).json({
    success: false,
    message: 'Внутренняя ошибка сервера',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  })
})

// === Запуск сервера ===
async function startServer() {
  try {
    // Подключаемся к базе данных
    await connectDB()
    
    // Запускаем сервер
    app.listen(PORT, () => {
      console.log(`\n🚀 Сервер запущен на порту ${PORT}`)
      console.log(`📍 Адрес: http://localhost:${PORT}`)
      console.log(`🐾 API доступно по адресу: http://localhost:${PORT}/api\n`)
    })
  } catch (error) {
    console.error('Ошибка запуска сервера:', error)
    process.exit(1)
  }
}

// Корректное завершение работы при остановке сервера
process.on('SIGINT', async () => {
  console.log('\n🛑 Остановка сервера...')
  await disconnectDB()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  console.log('\n🛑 Остановка сервера...')
  await disconnectDB()
  process.exit(0)
})

// Запускаем сервер
startServer()
