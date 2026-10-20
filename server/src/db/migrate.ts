import 'dotenv/config';
import { fileURLToPath } from 'node:url';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { db, pool } from './index.js';

/**
 * Applies pending SQL migrations. Unlike `drizzle-kit migrate` (a dev tool that
 * is not installed in the production image), this only needs drizzle-orm, so it
 * can run inside the production container.
 *
 * The path resolves the same way from `src/db` (tsx) and `dist/db` (compiled):
 * both are two levels below the server root that holds `src/db/migrations`.
 */
const migrationsFolder = fileURLToPath(
  new URL('../../src/db/migrations', import.meta.url),
);

async function run(): Promise<void> {
  console.log(`Applying migrations from ${migrationsFolder} ...`);
  await migrate(db, { migrationsFolder });
  console.log('Migrations are up to date.');
  await pool.end();
}

run().catch((error: unknown) => {
  console.error('Migration failed:', error);
  process.exit(1);
});

