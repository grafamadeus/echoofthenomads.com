import 'dotenv/config';
import { createHash } from 'node:crypto';

function required(name) {
  const v = process.env[name];
  if (!v || v.startsWith('CHANGE_ME')) {
    throw new Error(`Missing/placeholder env var: ${name}`);
  }
  return v;
}

export const config = {
  env: process.env.NODE_ENV || 'development',
  host: process.env.HOST || '127.0.0.1',
  port: Number(process.env.PORT || 3000),

  databaseUrl: required('DATABASE_URL'),
  redisUrl: required('REDIS_URL'),

  votePepper: required('VOTE_PEPPER'),
  googleClientId: required('GOOGLE_CLIENT_ID'),
  adminToken: required('ADMIN_TOKEN'),

  // Signs jury session tokens. Defaults to a value derived from the pepper,
  // so no env change is needed on existing deployments.
  juryJwtSecret: process.env.JURY_JWT_SECRET
    || createHash('sha256').update('jury:' + required('VOTE_PEPPER')).digest('hex'),

  allowedOrigins: (process.env.ALLOWED_ORIGINS || '')
    .split(',').map(s => s.trim()).filter(Boolean),

  fallbackWindow: {
    opensAt: process.env.VOTE_OPENS_AT || '2026-09-02T12:00:00+06:00',
    closesAt: process.env.VOTE_CLOSES_AT || '2026-09-04T23:59:00+06:00',
    frozen: false,
  },
};
