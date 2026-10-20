import 'dotenv/config';
import { z } from 'zod';

/**
 * Validates every environment variable the server needs, once, at startup.
 *
 * Why: without this, a missing JWT_SECRET only blows up on the first login
 * request (a confusing 500). Failing at boot, with a clear list of what is
 * wrong, is much easier to debug — especially inside a container.
 *
 * IMPORTANT: this must be the first import in src/index.ts so that dotenv has
 * loaded before any other module reads process.env.
 */
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(5000),
  CLIENT_ORIGIN: z.string().url().default('http://localhost:3000'),

  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  REDIS_URL: z.string().min(1).default('redis://localhost:6379'),

  JWT_SECRET: z
    .string()
    .min(32, 'JWT_SECRET must be at least 32 characters (try: openssl rand -hex 32)'),
  ADMIN_USERNAME: z.string().min(1, 'ADMIN_USERNAME is required'),
  ADMIN_PASSWORD_HASH: z
    .string()
    .regex(
      /^\$2[aby]\$\d{2}\$.{53}$/,
      'ADMIN_PASSWORD_HASH must be a bcrypt hash (generate one with: pnpm --filter @umar-portfolio/server hash-password)',
    ),

  // Secret "pepper" mixed into the visitor IP hash. Without it, anyone who
  // gets the database could brute-force every IPv4 address (only ~4 billion).
  ANALYTICS_SALT: z
    .string()
    .min(16, 'ANALYTICS_SALT must be at least 16 characters (try: openssl rand -hex 16)'),

  // Number of reverse proxies in front of the server (0 = none, 1 = Caddy).
  // Controls whether Express trusts the X-Forwarded-For header.
  TRUST_PROXY: z.coerce.number().int().min(0).max(5).default(0),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const details = parsed.error.issues
    .map((issue) => `  - ${issue.path.join('.') || 'env'}: ${issue.message}`)
    .join('\n');
  console.error(`\nInvalid environment configuration:\n${details}\n`);
  process.exit(1);
}

export const env = parsed.data;
export type Env = typeof env;

