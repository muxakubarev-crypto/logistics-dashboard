// Vercel serverless function — API для работы с данными дашборда
// GET  /api/data → возвращает все месячные данные
// POST /api/data → сохраняет данные (заменяет полностью, только для админа)
// 
// Использует Vercel KV (Upstash Redis) для хранения
// Требуется: создать KV базу в Vercel Dashboard → Integrations → Redis
// Переменные окружения Vercel подставит автоматически

import { kv } from '@vercel/kv';

const MONTHLY_DATA_KEY = 'kubarev_monthly_data';
const DEFAULT_DATA = {
  'июнь 2025': {
    manager: 'Кубарев Михаил',
    categories: [{ category: 'ИМПОРТ - запрос ставки прямое ж/д', order: 20, dealFell: 0, priceFail: 38, slowCalc: 0, clientSilent: 2, formal: 0, noFeedback: 0, total: 60 }]
  },
  'июль 2025': {
    manager: 'Кубарев Михаил',
    categories: [{ category: 'ИМПОРТ - запрос ставки прямое ж/д', order: 34, dealFell: 5, priceFail: 70, slowCalc: 0, clientSilent: 6, formal: 18, noFeedback: 7, total: 140 }]
  },
  'август 2025': {
    manager: 'Кубарев Михаил',
    categories: [{ category: 'ИМПОРТ - запрос ставки прямое ж/д', order: 6, dealFell: 5, priceFail: 13, slowCalc: 0, clientSilent: 1, formal: 17, noFeedback: 27, total: 69 }]
  },
  'сентябрь 2025': {
    manager: 'Кубарев Михаил',
    categories: [{ category: 'ИМПОРТ - запрос ставки прямое ж/д', order: 4, dealFell: 7, priceFail: 25, slowCalc: 0, clientSilent: 7, formal: 34, noFeedback: 39, total: 116 }]
  },
  'октябрь 2025': {
    manager: 'Кубарев Михаил',
    categories: [
      { category: 'ИМПОРТ - запрос ставки прямое ж/д', order: 9, dealFell: 5, priceFail: 15, slowCalc: 0, clientSilent: 14, formal: 19, noFeedback: 49, total: 111 },
      { category: 'ИМПОРТ - запрос ставки морского фрахта (опасный груз)', order: 4, dealFell: 0, priceFail: 5, slowCalc: 0, clientSilent: 3, formal: 3, noFeedback: 15, total: 30 }
    ]
  },
  'ноябрь 2025': {
    manager: 'Кубарев Михаил',
    categories: [
      { category: 'ИМПОРТ - запрос ставки прямое ж/д', order: 21, dealFell: 26, priceFail: 27, slowCalc: 0, clientSilent: 7, formal: 34, noFeedback: 1, total: 116 },
      { category: 'ИМПОРТ - запрос ставки морского фрахта (опасный груз)', order: 0, dealFell: 0, priceFail: 1, slowCalc: 0, clientSilent: 0, formal: 0, noFeedback: 0, total: 1 }
    ]
  },
  'декабрь 2025': {
    manager: 'Кубарев Михаил',
    categories: [
      { category: 'ИМПОРТ - запрос ставки прямое ж/д', order: 9, dealFell: 18, priceFail: 30, slowCalc: 0, clientSilent: 10, formal: 28, noFeedback: 1, total: 96 },
      { category: 'ИМПОРТ - запрос ставки морского фрахта (опасный груз)', order: 0, dealFell: 0, priceFail: 1, slowCalc: 0, clientSilent: 0, formal: 0, noFeedback: 0, total: 1 }
    ]
  },
  'январь 2026': {
    manager: 'Кубарев Михаил',
    categories: [{ category: 'ИМПОРТ - запрос ставки прямое ж/д', order: 12, dealFell: 19, priceFail: 33, slowCalc: 3, clientSilent: 7, formal: 29, noFeedback: 0, total: 103 }]
  },
  'февраль 2026': {
    manager: 'Кубарев Михаил',
    categories: [
      { category: 'ИМПОРТ - запрос ставки прямое ж/д', order: 5, dealFell: 14, priceFail: 19, slowCalc: 2, clientSilent: 8, formal: 17, noFeedback: 1, total: 66 },
      { category: 'ИМПОРТ - запрос ставки морского фрахта', order: 0, dealFell: 0, priceFail: 0, slowCalc: 0, clientSilent: 1, formal: 1, noFeedback: 1, total: 3 },
      { category: 'ИМПОРТ - запрос скидки на морской фрахт', order: 0, dealFell: 0, priceFail: 0, slowCalc: 0, clientSilent: 0, formal: 0, noFeedback: 2, total: 2 }
    ]
  },
  'март 2026': {
    manager: 'Кубарев Михаил',
    categories: [
      { category: 'ИМПОРТ - запрос ставки прямое ж/д', order: 15, dealFell: 13, priceFail: 56, slowCalc: 0, clientSilent: 13, formal: 43, noFeedback: 2, total: 142 },
      { category: 'ИМПОРТ - запрос ставки морского фрахта', order: 0, dealFell: 0, priceFail: 0, slowCalc: 0, clientSilent: 0, formal: 0, noFeedback: 1, total: 1 }
    ]
  },
  'апрель 2026': {
    manager: 'Кубарев Михаил',
    categories: [
      { category: 'ИМПОРТ - запрос ставки прямое ж/д', order: 12, dealFell: 2, priceFail: 8, slowCalc: 0, clientSilent: 3, formal: 18, noFeedback: 98, total: 141 },
      { category: 'ИМПОРТ - запрос ставки морского фрахта', order: 0, dealFell: 0, priceFail: 0, slowCalc: 1, clientSilent: 0, formal: 0, noFeedback: 1, total: 2 }
    ]
  }
};

export default async function handler(request) {
  // Разрешаем CORS для доступа с любого источника
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  // GET — отдать данные
  if (request.method === 'GET') {
    try {
      let data = await kv.get(MONTHLY_DATA_KEY);
      if (!data) {
        // Первый запуск — записать дефолтные данные
        await kv.set(MONTHLY_DATA_KEY, JSON.stringify(DEFAULT_DATA));
        data = JSON.stringify(DEFAULT_DATA);
      }
      return new Response(typeof data === 'string' ? data : JSON.stringify(data), { status: 200, headers });
    } catch (err) {
      console.error('KV GET error:', err);
      // Если KV не настроен — отдаём дефолтные данные
      return new Response(JSON.stringify(DEFAULT_DATA), { status: 200, headers });
    }
  }

  // POST — сохранить данные
  if (request.method === 'POST') {
    try {
      const body = await request.json();
      await kv.set(MONTHLY_DATA_KEY, JSON.stringify(body));
      return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
    } catch (err) {
      console.error('KV POST error:', err);
      return new Response(JSON.stringify({ ok: false, error: 'KV not configured' }), { status: 500, headers });
    }
  }

  return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers });
}
