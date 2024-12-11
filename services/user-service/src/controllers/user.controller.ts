import { Request, Response } from 'express';
import { User, IUser } from '../models/user.model';
import { AppError } from '../utils/errors';

export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser;
    res.json(user);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser;
    const allowedUpdates = ['firstName', 'lastName', 'email'];
    const updates = Object.keys(req.body)
      .filter(key => allowedUpdates.includes(key))
      .reduce((obj: any, key) => {
        obj[key] = req.body[key];
        return obj;
      }, {});

    if (Object.keys(updates).length === 0) {
      throw new AppError(400, 'No valid updates provided');
    }

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.json(updatedUser);
  } catch (err: any) {
    if (err instanceof AppError) {
      res.status(err.statusCode).json({ error: err.message });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser;
    await User.findByIdAndDelete(user._id);
    res.status(204).send();
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};