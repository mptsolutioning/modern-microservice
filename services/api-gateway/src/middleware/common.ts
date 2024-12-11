import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';

// Rate limiting middleware
export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// CORS configuration
export const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? ['https://yourdomain.com']
    : ['http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Request/Response transformation middleware
export const transformRequest = (req: Request, res: Response, next: NextFunction) => {
  // Add correlation ID
  req.headers['x-correlation-id'] = req.headers['x-correlation-id'] ||
    `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  next();
};