import { q } from '../db.js';
import { verifyGoogleToken } from '../lib/google.js';
import { signJuryToken, verifyJuryToken } from '../lib/jurytoken.js';

const CATEGORIES = ['ethno', 'world'];

async function getJurySetting() {
  const row = (await q(`SELECT value FROM app_setting WHERE key = 'jury'`)).rows[0];
  return { open: true, category: 'ethno', reveal: true, ...(row?.value || {}) };
}

// onRequest guard for juror-only routes
async function requireJuror(req, reply) {
  const hdr = req.headers.authorization || '';
  const tok = hdr.startsWith('Bearer ') ? hdr.slice(7) : '';
  const claims = verifyJuryToken(tok);
  if (!claims || !claims.jid) {
    return reply.code(401).send({ error: 'unauthorized' });
  }
  req.juror = claims; // { jid, email, exp }
}

export default async function juryRoutes(fastify) {
  // Exchange a Google ID token for a 12h jury session token.
  fastify.post('/api/jury/login', {
    config: { rateLimit: { max: 20, timeWindow: '5 minutes' } },
    schema: {
      body: {
        type: 'object',
        required: ['credential'],
        additionalProperties: false,
        properties: { credential: { type: 'string', minLength: 20, maxLength: 4096 } },
      },
    },
  }, async (req, reply) => {
    let gu;
    try {
      gu = await verifyGoogleToken(req.body.credential);
    } catch (e) {
      return reply.code(e.statusCode || 401).send({ error: e.message || 'auth_failed' });
    }
    const row = (await q(
      `SELECT id, display_name, role FROM juror WHERE lower(email) = lower($1) AND active`,
      [gu.email]
    )).rows[0];
    if (!row) return reply.code(403).send({ error: 'not_whitelisted' });

    const token = signJuryToken({ jid: row.id, email: gu.email }, 60 * 60 * 12);
    return { ok: true, token, juror: { id: row.id, name: row.display_name, role: row.role } };
  });

  // Panel state + this juror's own scores.
  fastify.get('/api/jury/state', { onRequest: requireJuror }, async (req) => {
    const s = await getJurySetting();
    const mine = (await q(
      `SELECT participant_id, category, score FROM jury_score WHERE juror_id = $1`,
      [req.juror.jid]
    )).rows;
    const scores = { ethno: {}, world: {} };
    for (const r of mine) (scores[r.category] ||= {})[r.participant_id] = r.score;
    return { open: s.open !== false, category: s.category, scores };
  });

  // Upsert one score.
  fastify.put('/api/jury/score', {
    onRequest: requireJuror,
    schema: {
      body: {
        type: 'object',
        required: ['participantId', 'category', 'score'],
        additionalProperties: false,
        properties: {
          participantId: { type: 'integer' },
          category: { type: 'string', enum: CATEGORIES },
          score: { type: 'integer', minimum: 1, maximum: 10 },
        },
      },
    },
  }, async (req, reply) => {
    const s = await getJurySetting();
    if (s.open === false) return reply.code(403).send({ error: 'jury_closed' });
    if (req.body.category !== s.category) {
      return reply.code(403).send({ error: 'wrong_category', active: s.category });
    }
    await q(
      `INSERT INTO jury_score (juror_id, participant_id, category, score)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (juror_id, participant_id, category)
       DO UPDATE SET score = EXCLUDED.score, updated_at = now()`,
      [req.juror.jid, req.body.participantId, req.body.category, req.body.score]
    );
    return { ok: true };
  });

  // Aggregated totals per participant per category (for the panel + live board).
  fastify.get('/api/jury/results', async (_req, reply) => {
    reply.header('Cache-Control', 'public, max-age=2');
    reply.header('Vary', 'Origin');
    const s = await getJurySetting();
    const jurorCount = (await q(`SELECT count(*)::int AS n FROM juror WHERE active`)).rows[0].n;
    const base = { open: s.open !== false, category: s.category, jurorCount };

    // Results temporarily hidden by the admin (HQ is reconciling scores).
    if (s.reveal === false) {
      return { ...base, hidden: true, totals: { ethno: {}, world: {} } };
    }

    const rows = (await q(
      `SELECT participant_id, category, sum(score)::int AS total, count(*)::int AS jurors
         FROM jury_score GROUP BY participant_id, category`
    )).rows;
    // shape: { ethno: { [pid]: {total, jurors} }, world: {...} }
    const totals = { ethno: {}, world: {} };
    for (const r of rows) totals[r.category][r.participant_id] = { total: r.total, jurors: r.jurors };
    return { ...base, hidden: false, totals };
  });
}
