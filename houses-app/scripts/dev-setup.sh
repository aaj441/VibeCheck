#!/bin/bash

# Vibe Check App Development Setup Script
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🛠️  Setting up Vibe Check App for Development${NC}"

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}📝 Creating .env file from .env.example...${NC}"
    cp .env.example .env
    echo -e "${YELLOW}⚠️  Please edit .env file with your actual configuration.${NC}"
fi

# Start development database and Redis
echo -e "${YELLOW}🗄️  Starting development database and Redis...${NC}"
docker-compose -f docker-compose.dev.yml up -d

# Wait for database to be ready
echo -e "${YELLOW}⏳ Waiting for database to be ready...${NC}"
sleep 10

# Install backend dependencies
echo -e "${YELLOW}📦 Installing backend dependencies...${NC}"
cd backend
npm install
cd ..

# Install frontend dependencies
echo -e "${YELLOW}📦 Installing frontend dependencies...${NC}"
cd frontend
npm install
cd ..

# Run database migrations
echo -e "${YELLOW}🗄️  Running database migrations...${NC}"
cd backend
npm run migrate
cd ..

echo -e "${GREEN}✅ Development setup completed!${NC}"
echo -e "${GREEN}🚀 To start development servers:${NC}"
echo -e "${YELLOW}  Backend: cd backend && npm run dev${NC}"
echo -e "${YELLOW}  Frontend: cd frontend && npm run dev${NC}"
echo -e "${GREEN}📱 Frontend will be available at: http://localhost:3000${NC}"
echo -e "${GREEN}🔧 Backend will be available at: http://localhost:3001${NC}"