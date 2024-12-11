import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'User Service API',
      version: '1.0.0',
      description: 'User management and authentication service',
    },
    servers: [
      {
        url: process.env.SERVICE_URL || 'http://localhost:3001',
      },
    ],
  },
  apis: ['./src/routes/*.ts'],
};

export const configureOpenAPI = (app: Express): void => {
  const specs = swaggerJsdoc(options);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};