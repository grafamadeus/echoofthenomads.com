import { buildApp } from './app.js';
import { config } from './config.js';
import { pool } from './db.js';
import { redis } from './redis.js';
import {
  loadParticipants, loadWindow, reconcileCountsFromDb, startResultsRefresher,
} from './lib/results.js';

async function main() {
  // Warm the in-memory snapshot before we accept traffic.
  await loadParticipants();
  await loadWindow();
  await reconcileCountsFromDb();
  startResultsRefresher(1000);

  const app = buildApp();
  await app.listen({ host: config.host, port: config.port });
  console.log(`echo-vote api on http://${config.host}:${config.port} (${config.env})`);

  const shutdown = async (sig) => {
    console.log(`\n${sig} — shutting down`);
    try { await app.close(); } catch {}
    try { await pool.end(); } catch {}
    try { await redis.quit(); } catch {}
    process.exit(0);
  };
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

main().catch((err) => {
  console.error('fatal on boot:', err);
  process.exit(1);
});
