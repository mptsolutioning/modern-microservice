import { Request, Response, NextFunction } from 'express';
import { IUser } from '../models/user.model';

export const requireRole = (role: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as IUser;
    if (!user.roles.includes(role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
};