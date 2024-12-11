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
    ws: true,
    secure: false,
    onProxyReq: (proxyReq: ClientRequest, req: Request) => {
      // Set user ID header first
      if (req.user?.sub) {
        proxyReq.setHeader('X-User-Id', req.user.sub);
      }

      // Handle JSON body if present
      if (req.body && Object.keys(req.body).length > 0) {
        const bodyData = JSON.stringify(req.body);
        // Set content headers
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        // Write body at the end
        proxyReq.end(bodyData);
      }

      // Log after everything is set
      console.log('[API Gateway] Proxying request:', {
        method: req.method,
        path: req.path,
        target: process.env.PRODUCT_SERVICE_URL || 'http://product-service:3002',
        headers: proxyReq.getHeaders(),
        body: req.body
      });
    },
    onError: (err, req, res) => {
      console.error('[API Gateway] Proxy error:', err);
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