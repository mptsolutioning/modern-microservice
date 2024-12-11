import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { ZodError } from 'zod';
import { MongooseError } from 'mongoose';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('[Error Handler]', {
    name: err.name,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });

  // Handle AppError (our custom errors)
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  }

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      status: 'fail',
      message: 'Validation error',
      errors: err.errors
    });
  }

  // Handle Mongoose errors
  if (err instanceof MongooseError) {
    if (err.name === 'CastError') {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid ID format'
      });
    }
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        status: 'fail',
        message: 'Validation error',
        errors: Object.values(err).map(e => e.message)
      });
    }
  }

  // Handle unknown errors
  return res.status(500).json({
    status: 'error',
    message: process.env.NODE_ENV === 'development'
      ? err.message
      : 'Internal server error'
  });
};