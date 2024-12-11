#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

if [ -z "$1" ]
then
    echo -e "${YELLOW}Showing logs for all services...${NC}"
    docker-compose logs -f
else
    echo -e "${YELLOW}Showing logs for $1...${NC}"
    docker-compose logs -f "$1"
fi