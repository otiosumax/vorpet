import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

// Инициализация клиента Groq (используем библиотеку OpenAI)
const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1', // Важный адрес для Groq
});

const SYSTEM_PROMPT = `
Ты — виртуальный питомец, живущий в браузере пользователя. 
Твоя цель: помогать пользователю работать с контентом, пересказывать статьи, отвечать на вопросы и просто болтать.
Твой характер: дружелюбный, любопытный, немного игривый, но профессиональный в вопросах работы.
Отвечай кратко и по делу, если пользователь не просит развернутый ответ.
Используй эмодзи, чтобы выражать эмоции, но не перебарщивай.
`;

/*
 * Генерирует ответ от ИИ
 * @param {string} userMessage - Сообщение пользователя или текст статьи
 * @param {string} taskType - Тип задачи: 'chat', 'summarize', 'qa'
 * @param {string} context - Дополнительный контекст (например, вопрос пользователя при пересказе)
 */

export const generateResponse = async (userMessage, taskType = 'chat', context = '') => {
  try {
    let finalPrompt = userMessage;
    
    // Формируем промпт в зависимости от задачи
    if (taskType === 'summarize') {
      finalPrompt = `Перескажи суть следующего текста кратко и понятно, выдели главные мысли. Текст: ${userMessage}`;
    } else if (taskType === 'qa') {
      finalPrompt = `Ответь на вопрос пользователя, основываясь на тексте ниже.\nВопрос: ${context}\nТекст страницы: ${userMessage}`;
    }

    const completion = await groq.chat.completions.create({
      model: process.env.GROQ_MODEL || 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: finalPrompt }
      ],
      temperature: 0.7, // Баланс между креативностью и точностью
      max_tokens: 1024,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Ошибка Groq API:', {
      status: error.status,
      code: error.code,
      type: error.type,
      message: error.message
    });

    throw new Error(`Не удалось получить ответ от питомца: ${error.message}`);
  }
};
