import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: jwt.JwtPayload;
    }
  }
}

const PUBLIC_ROUTES = [
  '/api/v1/auth/google',
  '/api/v1/auth/github',
  '/api/v1/auth/success',
  '/health',
  '/api-docs'
];

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Allow GET requests to /api/v1/products without auth
  if (req.path === '/api/v1/products' && req.method === 'GET') {
    return next();
  }

  // Check other public routes
  if (PUBLIC_ROUTES.some(route => req.path.startsWith(route))) {
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-jwt-secret');
    req.user = typeof decoded === 'string' ? JSON.parse(decoded) : decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};