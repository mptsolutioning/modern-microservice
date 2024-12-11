import { Router } from 'express';
import { createProduct, getProducts } from '../controllers/product.controller';

const router = Router();

// Debug middleware
router.use((req, res, next) => {
  console.log('[Product Routes] Received request:', {
    method: req.method,
    path: req.path,
    headers: req.headers,
    body: req.body
  });
  next();
});

router.post('/', createProduct);
router.get('/', getProducts);

export { router as productRoutes };