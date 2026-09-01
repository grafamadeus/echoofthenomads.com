import { createHash } from 'node:crypto';
import { config } from '../config.js';

// One-way, salted with the server-only pepper. If the DB leaks, these cannot
// be reversed to Google user IDs / IPs without the pepper.
const digest = (value) =>
  createHash('sha256').update(`${value}:${config.votePepper}`).digest('hex');

export const voterHash = (googleSub) => digest(`sub:${googleSub}`);
export const ipHash = (ip) => (ip ? digest(`ip:${ip}`) : null);
