import { PrismaClient } from '@prisma/client'

// Создаем экземпляр Prisma Client
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'], // Логи для отладки
})

// Функция для безопасного подключения к БД
export async function connectDB() {
  try {
    await prisma.$connect()
    console.log('✅ Успешное подключение к PostgreSQL через Prisma')
  } catch (error) {
    console.error('❌ Ошибка подключения к базе данных:', error.message)
    process.exit(1)
  }
}

// Функция для безопасного отключения
export async function disconnectDB() {
  await prisma.$disconnect()
  console.log('🔌 Отключение от базы данных')
}

export default prisma
