import { Request, Response } from 'express';
import { Product, IProduct } from '../models/product.model';

export const createProduct = async (req: Request, res: Response) => {
  try {
    console.log('[Product Controller] Creating product:', {
      headers: req.headers,
      body: req.body,
      userId: req.headers['x-user-id']
    });

    const userId = req.headers['x-user-id'];
    if (!userId) {
      console.log('[Product Controller] No user ID found in headers');
      return res.status(401).json({ error: 'User ID not provided' });
    }

    const product = await Product.create({
      ...req.body,
      ownerId: userId
    });

    console.log('[Product Controller] Product created:', product);
    res.status(201).json(product);
  } catch (err: any) {
    console.error('[Product Controller] Error:', err);
    res.status(400).json({ error: err.message });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, ownerId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({ error: 'Product not found or unauthorized' });
    }
    res.json(product);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      ownerId: req.user._id
    });
    if (!product) {
      return res.status(404).json({ error: 'Product not found or unauthorized' });
    }
    res.status(204).send();
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};