import { Request, Response, NextFunction } from 'express';
import { Product } from '../models/product.model';
import { CreateProductInput, UpdateProductInput } from '../schemas/product.schema';
import { NotFoundError, UnauthorizedError } from '../utils/errors';

export const createProduct = async (
  req: Request<{}, {}, CreateProductInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.headers['x-user-id'];
    if (!userId) {
      throw new UnauthorizedError('User ID not provided');
    }

    const product = await Product.create({
      ...req.body,
      ownerId: userId
    });

    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    next(err);
  }
};

export const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      throw new NotFoundError('Product not found');
    }
    res.json(product);
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (
  req: Request<{ id: string }, {}, UpdateProductInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.headers['x-user-id'];
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, ownerId: userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      throw new NotFoundError('Product not found or unauthorized');
    }
    res.json(product);
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.headers['x-user-id'];
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      ownerId: userId
    });

    if (!product) {
      throw new NotFoundError('Product not found or unauthorized');
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};