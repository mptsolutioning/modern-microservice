#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Stopping all containers and removing volumes...${NC}"
docker-compose down -v

echo -e "${YELLOW}Building and starting all services...${NC}"
docker-compose up --build -d

echo -e "${GREEN}Services are starting up. To view logs run:${NC}"
echo "docker-compose logs -f"