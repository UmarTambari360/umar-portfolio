import { Redis } from 'ioredis';
import { env } from './env.js';

export const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: 3,
});

redis.on('connect', () => {
  console.log('[Redis] Connected successfully to Redis server');
});

redis.on('error', (err: Error) => {
  console.error('[Redis] Connection error:', err.message);
});

