import Fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import { config } from './config.js';
import { redis } from './redis.js';
import publicRoutes from './routes/public.js';
import juryRoutes from './routes/jury.js';
import adminRoutes from './routes/admin.js';

export function buildApp() {
  const app = Fastify({
    trustProxy: true,            // behind nginx — use X-Forwarded-For for req.ip
    bodyLimit: 16 * 1024,
    logger: {
      level: config.env === 'production' ? 'warn' : 'info',
    },
  });

  app.register(cors, {
    origin: config.allowedOrigins.length ? config.allowedOrigins : false,
    methods: ['GET', 'POST'],
    maxAge: 86400,
  });

  app.register(rateLimit, {
    global: true,
    max: 120,                    // generous default; /api/vote overrides to 8/min
    timeWindow: '1 minute',
    redis,                       // shared store; survives multi-instance
    keyGenerator: (req) => req.ip,
    allowList: [],
  });

  app.get('/health', async () => ({ ok: true, ts: Date.now() }));

  app.register(publicRoutes);
  app.register(juryRoutes);
  app.register(adminRoutes);

  return app;
}
