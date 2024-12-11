import { Request, Response } from 'express';
import mongoose from 'mongoose';

export const healthCheck = async (req: Request, res: Response) => {
  const healthcheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
    mongoStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  };

  res.status(200).json(healthcheck);
};