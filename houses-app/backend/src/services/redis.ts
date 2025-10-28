import { createClient, RedisClientType } from 'redis';
import { config } from '../config';
import { logger } from '../utils/logger';

let redisClient: RedisClientType | null = null;

export async function initializeRedis(): Promise<void> {
  try {
    redisClient = createClient({
      url: config.redis.url,
    });
    
    redisClient.on('error', (err) => {
      logger.error('Redis Client Error', err);
    });
    
    redisClient.on('connect', () => {
      logger.info('Redis Client Connected');
    });
    
    await redisClient.connect();
  } catch (error) {
    logger.error('Failed to connect to Redis:', error);
    throw error;
  }
}

export function getRedisClient(): RedisClientType {
  if (!redisClient) {
    throw new Error('Redis not initialized');
  }
  return redisClient;
}

// Cache helpers
export async function getCached<T>(key: string): Promise<T | null> {
  try {
    const cached = await getRedisClient().get(key);
    return cached ? JSON.parse(cached) : null;
  } catch (error) {
    logger.error('Redis get error:', { key, error });
    return null;
  }
}

export async function setCached<T>(
  key: string, 
  value: T, 
  ttlSeconds?: number
): Promise<void> {
  try {
    const serialized = JSON.stringify(value);
    if (ttlSeconds) {
      await getRedisClient().setEx(key, ttlSeconds, serialized);
    } else {
      await getRedisClient().set(key, serialized);
    }
  } catch (error) {
    logger.error('Redis set error:', { key, error });
  }
}

export async function deleteCached(key: string): Promise<void> {
  try {
    await getRedisClient().del(key);
  } catch (error) {
    logger.error('Redis delete error:', { key, error });
  }
}