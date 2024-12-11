import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { productRoutes } from './routes/product.routes';

const app = express();

// Middleware
app.use(express.json());  // Make sure this is present
app.use(cors());
app.use(helmet());

// Debug logging
app.use((req, res, next) => {
  console.log(`[Product Service] ${req.method} ${req.path}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

// Routes
app.use('/api/v1/products', productRoutes);

// Basic error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

export { app };