import { Application } from 'express';
import { createProxyMiddleware, Options } from 'http-proxy-middleware';
import { Request } from 'express';
import { ClientRequest } from 'http';

const routes: Record<string, Options> = {
  '/api/v1/auth': {
    target: process.env.USER_SERVICE_URL || 'http://user-service:3001',
    pathRewrite: {
      '^/api/v1/auth': '/api/v1/auth'
    }
  },
  '/api/v1/users': {
    target: process.env.USER_SERVICE_URL || 'http://user-service:3001',
    pathRewrite: {
      '^/api/v1/users': '/api/v1/users'
    }
  },
  '/api/v1/products': {
    target: process.env.PRODUCT_SERVICE_URL || 'http://product-service:3002',
    pathRewrite: {
      '^/api/v1/products': '/api/v1/products'
    },
    onProxyReq: (proxyReq: ClientRequest, req: Request) => {
      // Set headers first
      if (req.user?.sub) {
        proxyReq.setHeader('X-User-Id', req.user.sub);
      }

      // Handle JSON body
      if (req.body && Object.keys(req.body).length > 0) {
        const stringifiedBody = JSON.stringify(req.body);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(stringifiedBody));
        // Write body to request
        proxyReq.write(stringifiedBody);
      }
      // Don't call end() here - let the proxy middleware handle it
    },
    onError: (err, req, res) => {
      console.error('Proxy error:', err);
      res.status(500).json({ error: 'Proxy error', details: err.message });
    }
  }
};

export const configureRoutes = (app: Application): void => {
  Object.entries(routes).forEach(([path, config]) => {
    console.log(`[API Gateway] Configuring route: ${path} -> ${config.target}`);
    app.use(path, createProxyMiddleware({
      ...config,
      changeOrigin: true,
      logLevel: 'debug',
      onProxyReq: config.onProxyReq,
      onError: config.onError
    }));
  });
};