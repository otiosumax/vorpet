# 🐾 AI Pet Backend

Бэкенд для браузерного расширения с интерактивным ИИ-питомцем.

## 📁 Структура проекта

```
backend/
├── prisma/
│   └── schema.prisma      # Схема базы данных (модели Prisma)
├── src/
│   ├── config/
│   │   └── database.js    # Настройка подключения к PostgreSQL через Prisma
│   ├── controllers/
│   │   └── petController.js  # Логика работы с питомцем (CRUD операции)
│   ├── routes/
│   │   ├── index.js       # Маршрутизация API
│   │   └── petRoutes.js   # Обработчики запросов
│   └── index.js           # Точка входа сервера
├── .env                   # Переменные окружения (не коммитить!)
├── .env.example           # Пример переменных окружения
└── package.json
```

## 🚀 Быстрый старт

### 1. Установка зависимостей
```bash
npm install
```

### 2. Настройка базы данных

Создайте файл `.env` и укажите строку подключения к PostgreSQL:
```
DATABASE_URL="postgresql://user:password@localhost:5432/aipetdb?schema=public"
PORT=3000
```

### 3. Генерация Prisma Client
```bash
npx prisma generate
```

### 4. Применение миграций (создание таблиц в БД)
```bash
npx prisma migrate dev --name init
```

### 5. Запуск сервера
```bash
# Режим разработки (с автоперезагрузкой)
npm run dev

# Продакшен режим
npm start
```

## 📡 API Endpoints

| Метод | Эндпоинт | Описание |
|-------|----------|----------|
| GET | `/api/pet/:userId` | Получить или создать питомца |
| PUT | `/api/pet/:userId/customize` | Обновить внешность питомца |
| PATCH | `/api/pet/:userId/mood` | Обновить настроение/опыт |
| POST | `/api/pet/:userId/summarize` | Пересказать статью |
| POST | `/api/pet/:userId/ask` | Задать вопрос по странице |
| POST | `/api/pet/:userId/chat` | Поболтать с питомцем |

## 🗄️ Модели базы данных

### Pet (Питомец)
- `userId` - уникальный ID пользователя
- `type` - тип питомца (cat, dog, fox...)
- `color` - цвет питомца
- `accessories` - массив аксессуаров (JSON)
- `mood` - настроение (happy, sad, excited, tired)
- `level` - уровень
- `experience` - опыт

### Interaction (Взаимодействие)
- `petId` - связь с питомцем
- `type` - тип взаимодействия (summary, qa, chat)
- `content` - содержимое запроса
- `metadata` - дополнительные данные (JSON)

## 🔧 Prisma команды

```bash
# Применить миграции
npx prisma migrate dev

# Создать новую миграцию
npx prisma migrate dev --name описание_изменений

# Открыть визуальный редактор БД
npx prisma studio

# Перегенерировать клиент после изменений схемы
npx prisma generate

# Сбросить базу данных
npx prisma migrate reset
```

## 🎓 Как это работает

1. **Prisma Schema** (`schema.prisma`) описывает структуру базы данных на понятном языке
2. При выполнении `prisma migrate` Prisma создает SQL-таблицы в PostgreSQL
3. **Prisma Client** автоматически генерируется и предоставляет типобезопасные методы для работы с БД
4. Контроллеры используют Prisma Client для CRUD операций
5. Маршруты (routes) связывают HTTP-запросы с контроллерами

## 📝 Пример использования Prisma

```javascript
import prisma from './config/database.js'

// Найти питомца
const pet = await prisma.pet.findUnique({
  where: { userId: 'user123' }
})

// Создать питомца
const newPet = await prisma.pet.create({
  data: {
    userId: 'user123',
    type: 'cat',
    color: '#FF5733'
  }
})

// Обновить питомца
const updated = await prisma.pet.update({
  where: { userId: 'user123' },
  data: { mood: 'happy', experience: { increment: 10 } }
})
```

## ⚠️ Важно

- Файл `.env` не должен попадать в git (добавьте его в `.gitignore`)
- В продакшене используйте надежные пароли и ограничьте CORS
- Для работы ИИ-функций потребуется добавить API ключи (OpenAI или другие)
