// Vercel serverless function — хранилище данных дашборда
// GET  /api/data → возвращает все месячные данные (общие для всех)
// POST /api/data → сохраняет данные (только админ через дашборд)
//
// Использует Upstash Redis (KV), который подключается через Vercel Integrations

import { Redis } from '@upstash/redis';

// Vercel автоматически подставляет переменные окружения после подключения Redis в ЛК
const redis = Redis.fromEnv();

const KEY = 'kubarev_monthly_data';

// Дефолтные данные — используются, если Redis ещё не настроен или пуст
const DEFAULT_DATA = {
  'июнь 2025': { manager: 'Кубарев Михаил', categories: [{ category: 'ИМПОРТ - запрос ставки прямое ж/д', order: 20, dealFell: 0, priceFail: 38, slowCalc: 0, clientSilent: 2, formal: 0, noFeedback: 0, total: 60 }] },
  'июль 2025': { manager: 'Кубарев Михаил', categories: [{ category: 'ИМПОРТ - запрос ставки прямое ж/д', order: 34, dealFell: 5, priceFail: 70, slowCalc: 0, clientSilent: 6, formal: 18, noFeedback: 7, total: 140 }] },
  'август 2025': { manager: 'Кубарев Михаил', categories: [{ category: 'ИМПОРТ - запрос ставки прямое ж/д', order: 6, dealFell: 5, priceFail: 13, slowCalc: 0, clientSilent: 1, formal: 17, noFeedback: 27, total: 69 }] },
  'сентябрь 2025': { manager: 'Кубарев Михаил', categories: [{ category: 'ИМПОРТ - запрос ставки прямое ж/д', order: 4, dealFell: 7, priceFail: 25, slowCalc: 0, clientSilent: 7, formal: 34, noFeedback: 39, total: 116 }] },
  'октябрь 2025': { manager: 'Кубарев Михаил', categories: [{ category: 'ИМПОРТ - запрос ставки прямое ж/д', order: 9, dealFell: 5, priceFail: 15, slowCalc: 0, clientSilent: 14, formal: 19, noFeedback: 49, total: 111 }, { category: 'ИМПОРТ - запрос ставки морского фрахта (опасный груз)', order: 4, dealFell: 0, priceFail: 5, slowCalc: 0, clientSilent: 3, formal: 3, noFeedback: 15, total: 30 }] },
  'ноябрь 2025': { manager: 'Кубарев Михаил', categories: [{ category: 'ИМПОРТ - запрос ставки прямое ж/д', order: 21, dealFell: 26, priceFail: 27, slowCalc: 0, clientSilent: 7, formal: 34, noFeedback: 1, total: 116 }, { category: 'ИМПОРТ - запрос ставки морского фрахта (опасный груз)', order: 0, dealFell: 0, priceFail: 1, slowCalc: 0, clientSilent: 0, formal: 0, noFeedback: 0, total: 1 }] },
  'декабрь 2025': { manager: 'Кубарев Михаил', categories: [{ category: 'ИМПОРТ - запрос ставки прямое ж/д', order: 9, dealFell: 18, priceFail: 30, slowCalc: 0, clientSilent: 10, formal: 28, noFeedback: 1, total: 96 }, { category: 'ИМПОРТ - запрос ставки морского фрахта (опасный груз)', order: 0, dealFell: 0, priceFail: 1, slowCalc: 0, clientSilent: 0, formal: 0, noFeedback: 0, total: 1 }] },
  'январь 2026': { manager: 'Кубарев Михаил', categories: [{ category: 'ИМПОРТ - запрос ставки прямое ж/д', order: 12, dealFell: 19, priceFail: 33, slowCalc: 3, clientSilent: 7, formal: 29, noFeedback: 0, total: 103 }] },
  'февраль 2026': { manager: 'Кубарев Михаил', categories: [{ category: 'ИМПОРТ - запрос ставки прямое ж/д', order: 5, dealFell: 14, priceFail: 19, slowCalc: 2, clientSilent: 8, formal: 17, noFeedback: 1, total: 66 }, { category: 'ИМПОРТ - запрос ставки морского фрахта', order: 0, dealFell: 0, priceFail: 0, slowCalc: 0, clientSilent: 1, formal: 1, noFeedback: 1, total: 3 }, { category: 'ИМПОРТ - запрос скидки на морской фрахт', order: 0, dealFell: 0, priceFail: 0, slowCalc: 0, clientSilent: 0, formal: 0, noFeedback: 2, total: 2 }] },
  'март 2026': { manager: 'Кубарев Михаил', categories: [{ category: 'ИМПОРТ - запрос ставки прямое ж/д', order: 15, dealFell: 13, priceFail: 56, slowCalc: 0, clientSilent: 13, formal: 43, noFeedback: 2, total: 142 }, { category: 'ИМПОРТ - запрос ставки морского фрахта', order: 0, dealFell: 0, priceFail: 0, slowCalc: 0, clientSilent: 0, formal: 0, noFeedback: 1, total: 1 }] },
  'апрель 2026': { manager: 'Кубарев Михаил', categories: [{ category: 'ИМПОРТ - запрос ставки прямое ж/д', order: 12, dealFell: 2, priceFail: 8, slowCalc: 0, clientSilent: 3, formal: 18, noFeedback: 98, total: 141 }, { category: 'ИМПОРТ - запрос ставки морского фрахта', order: 0, dealFell: 0, priceFail: 0, slowCalc: 1, clientSilent: 0, formal: 0, noFeedback: 1, total: 2 }] }
};

export default async function handler(request) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  // GET — отдать данные
  if (request.method === 'GET') {
    try {
      let data = await redis.get(KEY);
      if (!data || (typeof data === 'object' && Object.keys(data).length === 0)) {
        // Первый запуск — записать дефолтные данные в Redis
        await redis.set(KEY, JSON.stringify(DEFAULT_DATA));
        return new Response(JSON.stringify(DEFAULT_DATA), { status: 200, headers });
      }
      // Если Redis вернул строку — парсим, если объект — отдаём как есть
      const result = typeof data === 'string' ? JSON.parse(data) : data;
      return new Response(JSON.stringify(result), { status: 200, headers });
    } catch (err) {
      console.error('Redis GET error:', err);
      // Если Redis недоступен — отдаём дефолтные данные
      return new Response(JSON.stringify(DEFAULT_DATA), { status: 200, headers });
    }
  }

  // POST — сохранить данные
  if (request.method === 'POST') {
    try {
      const body = await request.json();
      await redis.set(KEY, JSON.stringify(body));
      return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
    } catch (err) {
      console.error('Redis POST error:', err);
      return new Response(JSON.stringify({ ok: false }), { status: 200, headers });
    }
  }

  return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers });
}
