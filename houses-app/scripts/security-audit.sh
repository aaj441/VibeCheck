#!/bin/bash

echo "🔒 Running Security Audit for Houses App"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track issues
ISSUES_FOUND=0

# Function to check for security issues
check_security() {
    local description=$1
    local command=$2
    local expected=$3
    
    echo -n "Checking: $description... "
    
    result=$(eval $command 2>&1)
    
    if [[ "$expected" == "empty" && -z "$result" ]]; then
        echo -e "${GREEN}✓${NC}"
    elif [[ "$expected" == "not-empty" && -n "$result" ]]; then
        echo -e "${GREEN}✓${NC}"
    elif [[ "$result" == *"$expected"* ]]; then
        echo -e "${GREEN}✓${NC}"
    else
        echo -e "${RED}✗${NC}"
        echo -e "${YELLOW}  Issue found: $result${NC}"
        ((ISSUES_FOUND++))
    fi
}

echo ""
echo "1. Checking for hardcoded secrets..."
echo "------------------------------------"

check_security "No hardcoded API keys" \
    "grep -r 'api[_-]key.*=.*[\"'\'']\w\+[\"'\'']' --include='*.ts' --include='*.js' --include='*.tsx' --include='*.jsx' . 2>/dev/null | grep -v '.env.example'" \
    "empty"

check_security "No hardcoded passwords" \
    "grep -r 'password.*=.*[\"'\'']\w\+[\"'\'']' --include='*.ts' --include='*.js' --include='*.tsx' --include='*.jsx' . 2>/dev/null | grep -v '.env.example' | grep -v 'test'" \
    "empty"

check_security "No hardcoded secrets" \
    "grep -r 'secret.*=.*[\"'\'']\w\+[\"'\'']' --include='*.ts' --include='*.js' --include='*.tsx' --include='*.jsx' . 2>/dev/null | grep -v '.env.example' | grep -v 'test'" \
    "empty"

echo ""
echo "2. Checking dependencies for vulnerabilities..."
echo "-----------------------------------------------"

cd backend
check_security "Backend dependency audit" \
    "npm audit --production 2>&1 | grep 'found 0 vulnerabilities'" \
    "found 0 vulnerabilities"

cd ../frontend
check_security "Frontend dependency audit" \
    "npm audit --production 2>&1 | grep 'found 0 vulnerabilities'" \
    "found 0 vulnerabilities"

cd ..

echo ""
echo "3. Checking security headers..."
echo "--------------------------------"

check_security "Helmet.js configured" \
    "grep -r 'helmet' backend/src/server.ts" \
    "helmet"

check_security "CORS configured" \
    "grep -r 'cors' backend/src/server.ts" \
    "cors"

check_security "Rate limiting configured" \
    "grep -r 'rateLimit' backend/src/server.ts" \
    "rateLimit"

echo ""
echo "4. Checking authentication..."
echo "------------------------------"

check_security "JWT secret not hardcoded" \
    "grep -r 'JWT_SECRET.*=.*[\"'\''][^$]' backend/src --include='*.ts' | grep -v 'process.env'" \
    "empty"

check_security "Password hashing used" \
    "grep -r 'bcrypt' backend/src" \
    "bcrypt"

check_security "Auth middleware present" \
    "grep -r 'authenticate' backend/src/middleware/auth.ts" \
    "authenticate"

echo ""
echo "5. Checking input validation..."
echo "--------------------------------"

check_security "Input validation middleware" \
    "grep -r 'express-validator' backend/package.json" \
    "express-validator"

check_security "SQL injection prevention" \
    "grep -r 'validateSQLInput' backend/src" \
    "validateSQLInput"

check_security "XSS prevention" \
    "grep -r 'sanitizeInput' backend/src" \
    "sanitizeInput"

echo ""
echo "6. Checking environment files..."
echo "---------------------------------"

check_security ".env files ignored" \
    "grep -r '^\.env$' .gitignore" \
    ".env"

check_security ".env.example exists (backend)" \
    "test -f backend/.env.example && echo 'exists'" \
    "exists"

check_security ".env.example exists (frontend)" \
    "test -f frontend/.env.example && echo 'exists'" \
    "exists"

echo ""
echo "7. Checking Docker security..."
echo "-------------------------------"

check_security "Non-root user in backend Dockerfile" \
    "grep -r 'USER' backend/Dockerfile" \
    "USER"

check_security "Non-root user in frontend Dockerfile" \
    "grep -r 'USER' frontend/Dockerfile" \
    "USER"

echo ""
echo "8. Checking HTTPS/TLS..."
echo "-------------------------"

check_security "SSL mentioned in deployment docs" \
    "grep -r 'SSL\|TLS\|HTTPS' DEPLOYMENT.md" \
    "SSL"

echo ""
echo "========================================"
if [ $ISSUES_FOUND -eq 0 ]; then
    echo -e "${GREEN}✓ Security audit passed! No issues found.${NC}"
    exit 0
else
    echo -e "${RED}✗ Security audit failed! Found $ISSUES_FOUND issue(s).${NC}"
    exit 1
fi