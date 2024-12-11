import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { productRoutes } from './routes/product.routes';
import { errorHandler } from './middleware/error.middleware';
import { configureSwagger } from './config/swagger';

const app = express();

// Middleware
app.use(express.json());  // Make sure this is first
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

// Configure Swagger
configureSwagger(app);

// Debug logging
app.use((req, res, next) => {
  console.log(`[Product Service] ${req.method} ${req.path}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

// Routes
app.use('/api/v1/products', productRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handling middleware (must be last)
app.use(errorHandler);

export { app };