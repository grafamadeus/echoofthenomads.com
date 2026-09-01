import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import pg from 'pg';
import 'dotenv/config';

const __dirname = dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = join(__dirname, '..', 'migrations');

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

async function main() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migration (
      filename   text PRIMARY KEY,
      applied_at timestamptz NOT NULL DEFAULT now()
    )`);

  const applied = new Set(
    (await pool.query('SELECT filename FROM schema_migration')).rows.map(r => r.filename)
  );

  const files = (await readdir(MIGRATIONS_DIR)).filter(f => f.endsWith('.sql')).sort();
  let ran = 0;

  for (const file of files) {
    if (applied.has(file)) continue;
    const sql = await readFile(join(MIGRATIONS_DIR, file), 'utf8');
    process.stdout.write(`applying ${file} ... `);
    const client = await pool.connect();
    try {
      await client.query(sql);
      await client.query('INSERT INTO schema_migration (filename) VALUES ($1)', [file]);
      console.log('ok');
      ran++;
    } catch (err) {
      console.log('FAILED');
      throw err;
    } finally {
      client.release();
    }
  }

  console.log(ran ? `${ran} migration(s) applied` : 'nothing to do');
}

main()
  .then(() => pool.end())
  .catch(err => { console.error(err); pool.end(); process.exit(1); });
