import Redis from 'ioredis';
import { config } from './config.js';

export const redis = new Redis(config.redisUrl, {
  lazyConnect: false,
  maxRetriesPerRequest: 2,
  enableOfflineQueue: true,
});

redis.on('error', (err) => {
  // Non-fatal: Postgres is the source of truth. Log and keep serving cached results.
  console.error('[redis]', err.message);
});

export const COUNTS_KEY = 'votes:counts'; // HASH participant_id -> count
