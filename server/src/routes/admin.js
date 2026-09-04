import { q } from '../db.js';
import { config } from '../config.js';
import { loadParticipants, loadWindow, setWindow, reconcileCountsFromDb } from '../lib/results.js';

export default async function adminRoutes(fastify) {
  // Bearer check (nginx should ALSO basic-auth /api/admin/).
  fastify.addHook('onRequest', async (req, reply) => {
    const hdr = req.headers.authorization || '';
    const token = hdr.startsWith('Bearer ') ? hdr.slice(7) : '';
    if (token !== config.adminToken) {
      return reply.code(401).send({ error: 'unauthorized' });
    }
  });

  // Open/close/freeze the voting window.
  fastify.post('/api/admin/window', {
    schema: {
      body: {
        type: 'object',
        properties: {
          opensAt: { type: 'string' },
          closesAt: { type: 'string' },
          frozen: { type: 'boolean' },
        },
      },
    },
  }, async (req) => {
    const cur = (await q(`SELECT value FROM app_setting WHERE key='voting_window'`)).rows[0]?.value || {};
    const next = { ...cur, ...req.body };
    await q(
      `INSERT INTO app_setting (key, value, updated_at) VALUES ('voting_window', $1, now())
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()`,
      [JSON.stringify(next)]
    );
    setWindow(next);
    return { ok: true, window: next };
  });

  // Emergency stop — takes effect within ~1s everywhere.
  fastify.post('/api/admin/freeze', async () => {
    await q(
      `UPDATE app_setting SET value = jsonb_set(value, '{frozen}', 'true'), updated_at = now()
        WHERE key = 'voting_window'`
    );
    await loadWindow();
    return { ok: true, frozen: true };
  });

  fastify.post('/api/admin/unfreeze', async () => {
    await q(
      `UPDATE app_setting SET value = jsonb_set(value, '{frozen}', 'false'), updated_at = now()
        WHERE key = 'voting_window'`
    );
    await loadWindow();
    return { ok: true, frozen: false };
  });

  // Set a participant's draw number.
  fastify.post('/api/admin/participant/:id/number', {
    schema: {
      params: { type: 'object', properties: { id: { type: 'integer' } }, required: ['id'] },
      body: {
        type: 'object',
        additionalProperties: false,
        properties: {
          number: { type: 'integer', minimum: 0, maximum: 999 },
          clear: { type: 'boolean' },
        },
      },
    },
  }, async (req) => {
    const value = req.body.clear ? null : (req.body.number ?? null);
    await q(`UPDATE participant SET perform_no = $1 WHERE id = $2`, [value, req.params.id]);
    await loadParticipants();
    return { ok: true, id: req.params.id, number: value };
  });

  // Rebuild the Redis counter from Postgres (truth).
  fastify.post('/api/admin/reconcile', async () => {
    await reconcileCountsFromDb();
    return { ok: true };
  });

  // ── Jury management ──
  fastify.get('/api/admin/jurors', async () =>
    (await q(`SELECT id, email, display_name, role, active FROM juror ORDER BY id`)).rows
  );

  fastify.post('/api/admin/juror', {
    schema: {
      body: {
        type: 'object',
        required: ['email', 'display_name'],
        additionalProperties: false,
        properties: {
          email: { type: 'string', minLength: 3, maxLength: 200 },
          display_name: { type: 'string', minLength: 1, maxLength: 120 },
          role: { type: 'string', enum: ['chair', 'member'] },
          active: { type: 'boolean' },
        },
      },
    },
  }, async (req) => {
    const { email, display_name, role = 'member', active = true } = req.body;
    const r = await q(
      `INSERT INTO juror (email, display_name, role, active)
       VALUES (lower($1), $2, $3, $4)
       ON CONFLICT (email) DO UPDATE SET
         display_name = EXCLUDED.display_name,
         role = EXCLUDED.role,
         active = EXCLUDED.active
       RETURNING id, email, display_name, role, active`,
      [email, display_name, role, active]
    );
    return { ok: true, juror: r.rows[0] };
  });

  // Flip the active jury category / open-closed.
  fastify.post('/api/admin/jury', {
    schema: {
      body: {
        type: 'object',
        additionalProperties: false,
        properties: {
          open: { type: 'boolean' },
          category: { type: 'string', enum: ['ethno', 'world'] },
          // true = fully shown, false = hidden, "protocol" = only the fixed award list
          reveal: { anyOf: [{ type: 'boolean' }, { type: 'string', enum: ['protocol'] }] },
        },
      },
    },
  }, async (req) => {
    const cur = (await q(`SELECT value FROM app_setting WHERE key='jury'`)).rows[0]?.value || {};
    const next = { open: true, category: 'ethno', reveal: true, ...cur, ...req.body };
    await q(
      `INSERT INTO app_setting (key, value, updated_at) VALUES ('jury', $1, now())
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()`,
      [JSON.stringify(next)]
    );
    return { ok: true, jury: next };
  });

  // Wipe jury scores (test cleanup).
  fastify.post('/api/admin/jury/reset', {
    schema: {
      body: {
        type: 'object', required: ['confirm'], additionalProperties: false,
        properties: { confirm: { type: 'string' } },
      },
    },
  }, async (req, reply) => {
    if (req.body.confirm !== 'reset') return reply.code(400).send({ error: 'confirm must be "reset"' });
    const before = (await q(`SELECT count(*)::int AS n FROM jury_score`)).rows[0].n;
    await q(`TRUNCATE jury_score`);
    return { ok: true, deleted: before };
  });

  // DESTRUCTIVE: wipe every public vote (e.g. clear a test run before go-live).
  // Requires body {"confirm":"reset"} on top of the bearer token.
  fastify.post('/api/admin/reset', {
    schema: {
      body: {
        type: 'object',
        required: ['confirm'],
        additionalProperties: false,
        properties: { confirm: { type: 'string' } },
      },
    },
  }, async (req, reply) => {
    if (req.body.confirm !== 'reset') {
      return reply.code(400).send({ error: 'confirm must be "reset"' });
    }
    const before = (await q(`SELECT count(*)::int AS n FROM vote`)).rows[0].n;
    await q(`TRUNCATE vote RESTART IDENTITY`);
    await reconcileCountsFromDb();   // clears the Redis hash + in-memory snapshot
    return { ok: true, deleted: before };
  });

  // Raw votes as CSV (audit / recount).
  fastify.get('/api/admin/export', async (_req, reply) => {
    const { rows } = await q(
      `SELECT v.id, v.created_at, p.slug, p.name, v.auth_method, v.ip_hash, v.geo_country
         FROM vote v JOIN participant p ON p.id = v.participant_id
        ORDER BY v.id`
    );
    const head = 'id,created_at,slug,name,auth_method,ip_hash,geo_country\n';
    const body = rows.map(r =>
      [r.id, r.created_at.toISOString(), r.slug, JSON.stringify(r.name), r.auth_method, r.ip_hash || '', r.geo_country || ''].join(',')
    ).join('\n');
    reply.header('Content-Type', 'text/csv; charset=utf-8');
    reply.header('Content-Disposition', 'attachment; filename="votes.csv"');
    return head + body + '\n';
  });
}
