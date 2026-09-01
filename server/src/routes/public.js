import { q } from '../db.js';
import { redis, COUNTS_KEY } from '../redis.js';
import { verifyGoogleToken } from '../lib/google.js';
import { voterHash, ipHash } from '../lib/hash.js';
import {
  getState, getResults, isOpen, participantBySlugOrId,
} from '../lib/results.js';

export default async function publicRoutes(fastify) {
  // Tiny: for the countdown / gate. Trust server time, not the client clock.
  fastify.get('/api/state', async (_req, reply) => {
    reply.header('Cache-Control', 'public, max-age=2');
    return getState();
  });

  // The endpoint the site polls (~every 4s). Served from the in-memory snapshot.
  fastify.get('/api/results', async (_req, reply) => {
    reply.header('Cache-Control', 'public, max-age=2, stale-while-revalidate=4');
    return getResults();
  });

  // Cast a vote.
  fastify.post('/api/vote', {
    config: { rateLimit: { max: 8, timeWindow: '1 minute' } },
    schema: {
      body: {
        type: 'object',
        required: ['participant', 'credential'],
        additionalProperties: false,
        properties: {
          participant: { type: 'string', minLength: 1, maxLength: 40 },
          credential: { type: 'string', minLength: 20, maxLength: 4096 },
        },
      },
    },
  }, async (req, reply) => {
    if (!isOpen()) {
      const st = getState();
      return reply.code(403).send({
        error: Date.now() < Date.parse(st.opensAt) ? 'not_open' : 'closed',
        opensAt: st.opensAt, closesAt: st.closesAt,
      });
    }

    const target = participantBySlugOrId(req.body.participant);
    if (!target) return reply.code(404).send({ error: 'unknown_participant' });

    let googleUser;
    try {
      googleUser = await verifyGoogleToken(req.body.credential);
    } catch (e) {
      return reply.code(e.statusCode || 401).send({ error: e.message || 'auth_failed' });
    }
    if (!googleUser.emailVerified) {
      return reply.code(403).send({ error: 'email_unverified' });
    }

    const vh = voterHash(googleUser.sub);
    const ih = ipHash(req.ip);
    const ua = (req.headers['user-agent'] || '').slice(0, 400);

    const ins = await q(
      `INSERT INTO vote (participant_id, voter_hash, auth_method, ip_hash, ua)
       VALUES ($1, $2, 'google', $3, $4)
       ON CONFLICT (voter_hash) DO NOTHING
       RETURNING participant_id`,
      [target.id, vh, ih, ua]
    );

    if (ins.rowCount === 0) {
      const prev = await q(
        `SELECT p.slug FROM vote v JOIN participant p ON p.id = v.participant_id
          WHERE v.voter_hash = $1`, [vh]
      );
      return reply.code(409).send({
        error: 'already_voted',
        participant: prev.rows[0]?.slug || null,
      });
    }

    let total = null;
    try {
      total = await redis.hincrby(COUNTS_KEY, String(target.id), 1);
    } catch {
      // vote is safely in Postgres; the refresher will pick it up on reconcile
    }

    return { ok: true, participant: target.slug, votes: total };
  });
}
