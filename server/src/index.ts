// Must stay the FIRST import: it loads .env and validates it before any other
// module (the database pool, Redis, auth) reads process.env.
import { env } from './lib/env.js';
import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js';
import projectRoutes from './routes/projects.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';
import { pool } from './db/index.js';
import { redis } from './lib/redis.js';

const app: Express = express();

// Behind a reverse proxy (Caddy in production) every request appears to come
// from the proxy's IP. TRUST_PROXY tells Express how many proxy hops to believe
// when reading X-Forwarded-For, so `req.ip` becomes the real visitor IP. Keep it
// at 0 when the server is exposed directly: otherwise anyone could fake their IP.
app.set('trust proxy', env.TRUST_PROXY);

app.use(helmet());
app.use(
  cors({
    origin: env.CLIENT_ORIGIN,
    credentials: true,
  }),
);

app.use(cookieParser());
// No request body here needs more than a few KB; a small cap blocks junk payloads.
app.use(express.json({ limit: '100kb' }));

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Broad safety net for the whole API; /login and /track add stricter limits.
app.use(
  '/api',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 600,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { error: { message: 'Too many requests' } },
  }),
);

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/analytics', analyticsRoutes);

app.use('/api', notFoundHandler);
app.use(errorHandler);

const server = app.listen(env.PORT, () => {
  console.log(`Server listening on port ${env.PORT} (${env.NODE_ENV})`);
});

/**
 * Docker stops a container by sending SIGTERM, then SIGKILL after ~10s.
 * Without handling it, in-flight requests are cut off and DB/Redis
 * connections are dropped mid-use. This finishes current requests first.
 */
function shutdown(signal: string): void {
  console.log(`${signal} received, shutting down gracefully...`);

  server.close(() => {
    void Promise.allSettled([pool.end(), redis.quit()]).then(() => {
      process.exit(0);
    });
  });

  // Safety net: never hang forever on a stuck connection.
  setTimeout(() => process.exit(1), 9000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

export default app;

