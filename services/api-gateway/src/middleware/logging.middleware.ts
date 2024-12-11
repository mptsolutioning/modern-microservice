import pino from 'pino-http';

export const requestLogger = pino({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  customProps: (req) => ({
    service: 'api-gateway',
    correlationId: req.headers['x-correlation-id']
  })
});