import { createHmac, timingSafeEqual } from 'node:crypto';
import { config } from '../config.js';

// Minimal signed token (HMAC-SHA256), no external dep. payload.exp is a unix ts.
const secret = config.juryJwtSecret;
const b64u = (buf) => Buffer.from(buf).toString('base64url');
const unb64u = (s) => Buffer.from(s, 'base64url');

export function signJuryToken(payload, ttlSeconds) {
  const body = { ...payload, exp: Math.floor(Date.now() / 1000) + ttlSeconds };
  const p = b64u(JSON.stringify(body));
  const sig = b64u(createHmac('sha256', secret).update(p).digest());
  return `${p}.${sig}`;
}

export function verifyJuryToken(token) {
  if (!token || typeof token !== 'string' || token.indexOf('.') < 0) return null;
  const [p, sig] = token.split('.');
  const expected = createHmac('sha256', secret).update(p).digest();
  let given;
  try { given = unb64u(sig); } catch { return null; }
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null;
  let body;
  try { body = JSON.parse(unb64u(p).toString('utf8')); } catch { return null; }
  if (!body.exp || body.exp < Math.floor(Date.now() / 1000)) return null;
  return body;
}
