#!/bin/bash

echo "🚀 Houses App Pre-Deployment Check"
echo "=================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Track overall status
ALL_CHECKS_PASSED=true

# Function to run a check
run_check() {
    local name=$1
    local command=$2
    
    echo -ne "${BLUE}Running:${NC} $name... "
    
    if eval $command > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Passed${NC}"
    else
        echo -e "${RED}✗ Failed${NC}"
        ALL_CHECKS_PASSED=false
    fi
}

# Function to check if file exists
check_file() {
    local name=$1
    local file=$2
    
    echo -ne "${BLUE}Checking:${NC} $name... "
    
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓ Exists${NC}"
    else
        echo -e "${RED}✗ Missing${NC}"
        ALL_CHECKS_PASSED=false
    fi
}

echo "1. Environment Configuration"
echo "----------------------------"
check_file "Backend .env.example" "backend/.env.example"
check_file "Frontend .env.example" "frontend/.env.example"
check_file "Docker Compose files" "docker-compose.yml"
check_file "Development Docker Compose" "docker-compose.dev.yml"
check_file "Test Docker Compose" "docker-compose.test.yml"

echo ""
echo "2. Documentation"
echo "----------------"
check_file "Main README" "README.md"
check_file "Deployment Guide" "DEPLOYMENT.md"
check_file "API Documentation" "backend/src/routes/index.ts"

echo ""
echo "3. Backend Checks"
echo "-----------------"
cd backend
run_check "TypeScript compilation" "npx tsc --noEmit"
run_check "ESLint" "npm run lint"
run_check "Unit tests" "npm test -- --passWithNoTests"
cd ..

echo ""
echo "4. Frontend Checks"
echo "------------------"
cd frontend
run_check "TypeScript compilation" "npm run type-check"
run_check "ESLint" "npm run lint"
run_check "Next.js build" "npm run build"
cd ..

echo ""
echo "5. Docker Build"
echo "---------------"
run_check "Backend Docker build" "docker build -t houses-backend-test ./backend"
run_check "Frontend Docker build" "docker build -t houses-frontend-test ./frontend --build-arg NEXT_PUBLIC_API_URL=http://localhost:3001/api --build-arg NEXT_PUBLIC_WEBSOCKET_URL=http://localhost:3001"

echo ""
echo "6. Security Checks"
echo "------------------"
if [ -f "scripts/security-audit.sh" ]; then
    run_check "Security audit" "./scripts/security-audit.sh"
else
    echo -e "${YELLOW}⚠ Security audit script not found${NC}"
fi

echo ""
echo "7. Database"
echo "-----------"
check_file "Initial migration" "database/migrations/0001_init.sql"
check_file "Seed data" "database/seed-data.sql"

echo ""
echo "8. CI/CD Configuration"
echo "----------------------"
check_file "CI workflow" ".github/workflows/ci.yml"
check_file "Deploy workflow" ".github/workflows/deploy.yml"

echo ""
echo "=================================="
if [ "$ALL_CHECKS_PASSED" = true ]; then
    echo -e "${GREEN}✓ All checks passed!${NC} The application is ready for deployment."
    echo ""
    echo "Next steps:"
    echo "1. Review and update environment variables"
    echo "2. Run 'docker-compose up' to test locally"
    echo "3. Deploy using your preferred method (see DEPLOYMENT.md)"
    exit 0
else
    echo -e "${RED}✗ Some checks failed!${NC} Please fix the issues before deploying."
    echo ""
    echo "Tips:"
    echo "- Run 'npm install' in both backend and frontend directories"
    echo "- Ensure all required files are present"
    echo "- Fix any linting or compilation errors"
    exit 1
fi