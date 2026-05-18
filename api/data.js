import { createHash } from 'node:crypto';

const KV_URL = process.env.KV_REST_API_URL || 'https://vast-pegasus-127619.upstash.io';
const KV_TOKEN = process.env.KV_REST_API_TOKEN || 'gQAAAAAAAfKDAAIgcDE4MzdhNTQzNzhjMTU0MTI1ODJmMTE3OGIzNDYyYjE4MA';

// SHA-256 of '08250825'
const ADMIN_HASH = createHash('sha256').update('08250825').digest('hex');

// Простой хелпер для Upstash KV REST API (без SDK)
async function kvGet(key) {
  const r = await fetch(`${KV_URL}/get/${key}`, {
    headers: { Authorization: `Bearer ${KV_TOKEN}` },
  });
  if (!r.ok) throw new Error(`KV GET failed: ${r.status}`);
  const d = await r.json();
  return d.result;
}

async function kvSet(key, value) {
  const r = await fetch(`${KV_URL}/set/${key}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${KV_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(value),
  });
  if (!r.ok) throw new Error(`KV SET failed: ${r.status}`);
  return r.json();
}

async function kvDel(key) {
  const r = await fetch(`${KV_URL}/del/${key}`, {
    headers: { Authorization: `Bearer ${KV_TOKEN}` },
  });
  if (!r.ok) throw new Error(`KV DEL failed: ${r.status}`);
  return r.json();
}

const DATA_KEY = 'kubarev_monthly_data';

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
      const data = (await kvGet(DATA_KEY)) || {};
      return res.status(200).json(data);
    }

    // ── POST — полная замена данных ──
    if (req.method === 'POST') {
      const current = (await kvGet(DATA_KEY)) || {};

      if (!current || Object.keys(current).length === 0) {
        await kvSet(DATA_KEY, req.body);
        return res.status(200).json({ ok: true, seeded: true });
      }

      if (!isAdmin) {
        return res.status(403).json({ error: 'Forbidden: admin access required' });
      }

      await kvSet(DATA_KEY, req.body);
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

      const current = (await kvGet(DATA_KEY)) || {};
      current[month] = monthData;
      await kvSet(DATA_KEY, current);
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

      const current = (await kvGet(DATA_KEY)) || {};
      if (current[month]) {
        delete current[month];
        await kvSet(DATA_KEY, current);
      }
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API Error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
