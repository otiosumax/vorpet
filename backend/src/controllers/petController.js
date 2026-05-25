import prisma from '../config/database.js'

// Получить питомца по userId
export async function getPetByUserId(userId) {
  return await prisma.pet.findUnique({
    where: { userId },
    include: {
      interactions: {
        orderBy: { createdAt: 'desc' },
        take: 10 // Последние 10 взаимодействий
      }
    }
  })
}

// Создать нового питомца
export async function createPet(userId, petData = {}) {
  return await prisma.pet.create({
    data: {
      userId,
      type: petData.type || 'cat',
      color: petData.color || '#FFFFFF',
      accessories: petData.accessories || [],
      mood: petData.mood || 'happy',
      level: petData.level || 1,
      experience: petData.experience || 0
    }
  })
}

// Обновить внешность питомца
export async function updatePetAppearance(userId, updates) {
  return await prisma.pet.update({
    where: { userId },
    data: {
      ...(updates.type && { type: updates.type }),
      ...(updates.color && { color: updates.color }),
      ...(updates.accessories && { accessories: updates.accessories }),
    }
  })
}

// Обновить настроение и опыт питомца
export async function updatePetStats(userId, stats) {
  return await prisma.pet.update({
    where: { userId },
    data: {
      ...(stats.mood && { mood: stats.mood }),
      ...(stats.experience !== undefined && { 
        experience: { increment: stats.experience }
      }),
    }
  })
}

// Добавить запись о взаимодействии
export async function createInteraction(petId, type, content, metadata = {}) {
  return await prisma.interaction.create({
    data: {
      petId,
      type,
      content,
      metadata
    }
  })
}

// Получить историю взаимодействий
export async function getPetInteractions(petId, limit = 20) {
  return await prisma.interaction.findMany({
    where: { petId },
    orderBy: { createdAt: 'desc' },
    take: limit
  })
}

// Удалить питомца (если пользователь захочет сбросить прогресс)
export async function deletePet(userId) {
  return await prisma.pet.delete({
    where: { userId }
  })
}
