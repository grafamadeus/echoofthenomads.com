import { q } from '../db.js';
import { redis, COUNTS_KEY } from '../redis.js';
import { config } from '../config.js';

// ── In-memory snapshot, rebuilt from Redis on a timer ─────────────────────────
// Every client poll is served from this object — zero DB/Redis work per request.
let participants = [];        // [{id, slug, name, country, country_code, perform_no}]
let counts = {};              // { [id]: number }
let window = { ...config.fallbackWindow };
let lastBuilt = 0;
let timer = null;

export async function loadParticipants() {
  const { rows } = await q(
    `SELECT id, slug, name, country, country_code, perform_no
       FROM participant WHERE active ORDER BY sort_order, id`
  );
  participants = rows;
}

export async function loadWindow() {
  const { rows } = await q(`SELECT value FROM app_setting WHERE key = 'voting_window'`);
  if (rows[0]?.value) window = { ...config.fallbackWindow, ...rows[0].value };
}

// Postgres is the source of truth. Push its tallies into Redis so the hot
// counter matches reality after any restart / Redis flush / data loss.
export async function reconcileCountsFromDb() {
  const { rows } = await q(
    `SELECT participant_id AS id, COUNT(*)::int AS n FROM vote GROUP BY participant_id`
  );
  const pipeline = redis.pipeline();
  pipeline.del(COUNTS_KEY);
  for (const r of rows) pipeline.hset(COUNTS_KEY, String(r.id), r.n);
  try {
    await pipeline.exec();
  } catch (e) {
    console.error('[results] reconcile skipped (redis down):', e.message);
  }
  counts = Object.fromEntries(rows.map(r => [r.id, r.n]));
}

async function refreshFromRedis() {
  try {
    const flat = await redis.hgetall(COUNTS_KEY);
    const next = {};
    for (const [id, n] of Object.entries(flat)) next[id] = Number(n) || 0;
    counts = next;
    lastBuilt = Date.now();
  } catch {
    // keep last-known counts; stay alive
  }
}

export function startResultsRefresher(intervalMs = 1000) {
  if (timer) return;
  timer = setInterval(refreshFromRedis, intervalMs);
  timer.unref?.();
}

// ── Public accessors ─────────────────────────────────────────────────────────
export function isOpen(now = Date.now()) {
  if (window.frozen) return false;
  const opens = Date.parse(window.opensAt);
  const closes = Date.parse(window.closesAt);
  return now >= opens && now <= closes;
}

export function getState() {
  return {
    open: isOpen(),
    frozen: !!window.frozen,
    opensAt: window.opensAt,
    closesAt: window.closesAt,
    serverTime: new Date().toISOString(),
  };
}

export function getResults() {
  let total = 0;
  const list = participants.map(p => {
    const votes = counts[p.id] || 0;
    total += votes;
    return {
      id: p.id,
      slug: p.slug,
      name: p.name,
      country: p.country,
      code: p.country_code,
      number: p.perform_no,
      votes,
    };
  });
  return { ...getState(), total, updatedAt: new Date(lastBuilt || Date.now()).toISOString(), participants: list };
}

export function participantBySlugOrId(key) {
  const s = String(key);
  return participants.find(p => p.slug === s || String(p.id) === s) || null;
}

export function setWindow(next) { window = { ...window, ...next }; }
