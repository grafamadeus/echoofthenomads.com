import { OAuth2Client } from 'google-auth-library';
import { config } from '../config.js';

const client = new OAuth2Client(config.googleClientId);

/**
 * Verify a Google Identity Services ID token.
 * Returns { sub, email, emailVerified } or throws.
 */
export async function verifyGoogleToken(idToken) {
  if (!idToken || typeof idToken !== 'string') {
    const e = new Error('missing_credential');
    e.statusCode = 400;
    throw e;
  }
  let ticket;
  try {
    ticket = await client.verifyIdToken({
      idToken,
      audience: config.googleClientId,
    });
  } catch {
    const e = new Error('bad_credential');
    e.statusCode = 401;
    throw e;
  }
  const p = ticket.getPayload();
  const iss = p.iss;
  if (iss !== 'accounts.google.com' && iss !== 'https://accounts.google.com') {
    const e = new Error('bad_issuer');
    e.statusCode = 401;
    throw e;
  }
  return { sub: p.sub, email: p.email, emailVerified: p.email_verified === true };
}
