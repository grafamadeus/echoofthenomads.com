import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import pg from 'pg';
import 'dotenv/config';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

async function main() {
  const participants = JSON.parse(
    await readFile(join(__dirname, '..', 'data', 'participants.json'), 'utf8')
  );

  for (const [i, p] of participants.entries()) {
    await pool.query(
      `INSERT INTO participant (id, slug, name, country, country_code, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6)
       ON CONFLICT (id) DO UPDATE SET
         slug = EXCLUDED.slug,
         name = EXCLUDED.name,
         country = EXCLUDED.country,
         country_code = EXCLUDED.country_code,
         sort_order = EXCLUDED.sort_order`,
      [p.id, p.slug, p.name, p.country, p.country_code, i]
    );
  }

  console.log(`seeded ${participants.length} participants`);
  console.log('NOTE: site says "21 participants" but the list has ' + participants.length +
    ' — confirm the roster before go-live.');
  // Jurors are phase 2 (jury.html). Seed them then, from real whitelisted emails.
}

main()
  .then(() => pool.end())
  .catch(err => { console.error(err); pool.end(); process.exit(1); });
