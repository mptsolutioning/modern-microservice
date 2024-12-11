import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from './middleware/error.middleware';
import { healthCheck } from './middleware/health.middleware';
import { configureOpenAPI } from './config/swagger';
import { routes } from './routes';
import { authRoutes } from './routes/auth.routes';
import passport from 'passport';
import { configureAuth } from './middleware/auth.middleware';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', healthCheck);

// Configure OpenAPI
configureOpenAPI(app);

// Authentication middleware
app.use(passport.initialize());
configureAuth();

// Routes
app.use('/api/v1', routes);
app.use('/api/v1/auth', authRoutes);

// Error handling
app.use(errorHandler);

export { app };