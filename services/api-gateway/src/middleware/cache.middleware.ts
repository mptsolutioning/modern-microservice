import { Request, Response, NextFunction } from 'express';
import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'user-service-cache',
  port: 6379
});

export const cacheMiddleware = (ttl: number = 60) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== 'GET') {
      return next();
    }

    const key = `cache:${req.originalUrl}`;
    try {
      const cached = await redis.get(key);
      if (cached) {
        return res.json(JSON.parse(cached));
      }

      const originalJson = res.json;
      res.json = function(body) {
        redis.setex(key, ttl, JSON.stringify(body));
        return originalJson.call(this, body);
      };

      next();
    } catch (error) {
      next(error);
    }
  };
};