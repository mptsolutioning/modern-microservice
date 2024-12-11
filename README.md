# Modern Microservices Demo

A demonstration of microservices architecture using Node.js, MongoDB, and Docker.

## Services

- **User Service** (Port 3001): Handles user authentication and management
- **Product Service** (Port 3002): Manages product catalog
- **Jaeger** (Port 16686): Distributed tracing

## Getting Started

1. Clone the repository and navigate to the project directory

2. Make scripts executable:
   ```bash
   chmod +x scripts/restart.sh scripts/logs.sh
   ```

3. Build and start all services:
   ```bash
   # Using the restart script
   ./scripts/restart.sh

   # View logs
   ./scripts/logs.sh          # All services
   ./scripts/logs.sh api-gateway  # Specific service
   ```

## Testing Authentication Flow

1. Access Google OAuth through the API Gateway:
   ```bash
   # Open in browser
   http://localhost:3000/api/v1/auth/google
   ```

2. After successful authentication, copy the JWT token from the success page and save it:
   ```bash
   # Save token to environment variable
   export JWT_TOKEN="your_copied_token_here"

   # Verify token is saved
   echo $JWT_TOKEN
   ```

3. Test protected routes through the API Gateway:
   ```bash
   # Get user profile
   curl http://localhost:3000/api/v1/users/profile \
     -H "Authorization: Bearer ${JWT_TOKEN}"

   # Create product
   curl -X POST http://localhost:3000/api/v1/products \
     -H "Authorization: Bearer ${JWT_TOKEN}" \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test Product",
       "description": "A test product",
       "price": 99.99,
       "category": "test"
     }'
   ```

## Testing the API Gateway

1. All services are accessed through the API Gateway (Port 3000):
   ```bash
   # Authentication through gateway
   http://localhost:3000/api/v1/auth/google

   # User Service endpoints
   curl http://localhost:3000/api/v1/users/profile \
     -H "Authorization: Bearer ${JWT_TOKEN}"

   # Product Service endpoints
   curl http://localhost:3000/api/v1/products \
     -H "Authorization: Bearer ${JWT_TOKEN}"
   ```

2. Create and test a product:
   ```bash
   # Create product through gateway
   curl -X POST http://localhost:3000/api/v1/products \
     -H "Authorization: Bearer ${JWT_TOKEN}" \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test Product",
       "description": "A test product",
       "price": 99.99,
       "category": "test"
     }'

   # Get all products (public route)
   curl http://localhost:3000/api/v1/products
   ```

3. Test rate limiting:
   ```bash
   # Make multiple requests quickly to trigger rate limit
   for i in {1..200}; do
     curl http://localhost:3000/api/v1/products
   done
   ```

4. Verify request logging:
   ```bash
   # Watch API Gateway logs
   docker-compose logs -f api-gateway
   ```

## API Documentation

- User Service Swagger: http://localhost:3001/api-docs
- Product Service Swagger: http://localhost:3002/api-docs

## Monitoring

- Jaeger UI: http://localhost:16686

## Service Architecture

Each service follows a standard structure:
- /src
  - /models - Database models
  - /controllers - Business logic
  - /routes - API endpoints
  - /middleware - Request processing
  - /config - Service configuration

## Environment Variables

Key variables in docker-compose.yml:
- MONGODB_URI - Database connection
- JWT_SECRET - Authentication secret
- GOOGLE_CLIENT_ID/SECRET - OAuth credentials

## Development

1. Install dependencies: `npm install` in each service directory
2. Run individual services: `npm run dev`
3. Watch logs: `docker-compose logs -f [service-name]`

## API Structure

All services follow a consistent API structure:

- User Service:
  - `/api/v1/auth/*` - Authentication routes
  - `/api/v1/users/*` - User management routes

- Product Service:
  - `/api/v1/products/*` - Product management routes

All routes are accessed through the API Gateway at `http://localhost:3000`