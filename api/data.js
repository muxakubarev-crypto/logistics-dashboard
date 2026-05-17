import { Redis } from '@upstash/redis';
import { createHash } from 'crypto';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

const DATA_KEY = 'kubarev_monthly_data';

// SHA-256 of '08250825' — предвычислено
const ADMIN_HASH = createHash('sha256').update('08250825').digest('hex');

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, x-admin-token',
  };
}

export default async function handler(req, res) {
  const headers = corsHeaders();
  Object.entries(headers).forEach(([k, v]) => res.setHeader(k, v));

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const isAdmin = req.headers['x-admin-token'] === ADMIN_HASH;

  try {
    // ── GET — получить все данные (публичный) ──
    if (req.method === 'GET') {
      const data = (await redis.get(DATA_KEY)) || {};
      return res.status(200).json(data);
    }

    // ── POST — полная замена данных ──
    if (req.method === 'POST') {
      const current = (await redis.get(DATA_KEY)) || {};

      // Если KV пуст — разрешаем засеять без авторизации
      if (!current || Object.keys(current).length === 0) {
        await redis.set(DATA_KEY, req.body);
        return res.status(200).json({ ok: true, seeded: true });
      }

      if (!isAdmin) {
        return res.status(403).json({ error: 'Forbidden: admin access required' });
      }

      await redis.set(DATA_KEY, req.body);
      return res.status(200).json({ ok: true });
    }

    // ── PUT — обновить/добавить один месяц ──
    if (req.method === 'PUT') {
      if (!isAdmin) {
        return res.status(403).json({ error: 'Forbidden: admin access required' });
      }

      const { month, data: monthData } = req.body || {};
      if (!month || !monthData) {
        return res.status(400).json({ error: 'month and data fields are required' });
      }

      const current = (await redis.get(DATA_KEY)) || {};
      current[month] = monthData;
      await redis.set(DATA_KEY, current);
      return res.status(200).json({ ok: true });
    }

    // ── DELETE — удалить месяц ──
    if (req.method === 'DELETE') {
      if (!isAdmin) {
        return res.status(403).json({ error: 'Forbidden: admin access required' });
      }

      const { month } = req.query;
      if (!month) {
        return res.status(400).json({ error: 'month query parameter is required' });
      }

      const current = (await redis.get(DATA_KEY)) || {};
      if (current[month]) {
        delete current[month];
        await redis.set(DATA_KEY, current);
      }
      return res.status(200).json({ ok: true });
    }

    // ── Неподдерживаемый метод ──
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API Error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
