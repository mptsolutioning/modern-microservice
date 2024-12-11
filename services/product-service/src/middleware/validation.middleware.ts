import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';

export const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log('Validating request body:', req.body);
      await schema.parseAsync(req.body);
      console.log('Validation successful');
      next();
    } catch (error) {
      console.error('Validation failed:', error);
      res.status(400).json({ error: error.errors });
    }
  };
};