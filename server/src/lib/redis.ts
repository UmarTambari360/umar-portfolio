import { Redis } from 'ioredis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

export const redis = new Redis(redisUrl, {
  maxRetriesPerRequest: 3,
});

redis.on('connect', () => {
  console.log('[Redis] Connected successfully to Redis server');
});

redis.on('error', (err: Error) => {
  console.error('[Redis] Connection error:', err.message);
});