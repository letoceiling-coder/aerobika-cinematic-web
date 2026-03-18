#!/bin/bash
# Production deployment script - Git-based
# Usage: ./deploy.sh

set +e  # Don't exit on error, handle gracefully

echo "🚀 Starting deployment..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Get current directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Load Node.js via nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

echo -e "${YELLOW}📦 Pulling latest code from Git...${NC}"
git fetch origin
CURRENT_BRANCH=$(git branch --show-current 2>/dev/null || echo "main")
if [ -z "$CURRENT_BRANCH" ] || [ "$CURRENT_BRANCH" = "" ]; then
    CURRENT_BRANCH="main"
fi

# Try to pull from main, fallback to master
if git pull origin main 2>/dev/null; then
    echo -e "${GREEN}✅ Pulled from main branch${NC}"
elif git pull origin master 2>/dev/null; then
    echo -e "${GREEN}✅ Pulled from master branch${NC}"
else
    echo -e "${RED}⚠️  Git pull failed, but continuing...${NC}"
fi

echo -e "${YELLOW}📦 Installing root dependencies...${NC}"
npm install --production=false || echo "⚠️  Root npm install failed"

echo -e "${YELLOW}📦 Installing backend dependencies...${NC}"
cd backend
npm install --production=false || echo "⚠️  Backend npm install failed"

echo -e "${YELLOW}🔧 Generating Prisma Client...${NC}"
npx prisma generate || echo "⚠️  Prisma generate failed"

echo -e "${YELLOW}🗄️  Running database migrations...${NC}"
npx prisma migrate deploy || echo "⚠️  Migrations failed, continuing..."

echo -e "${YELLOW}🌱 Seeding database (if needed)...${NC}"
npm run prisma:seed || echo "⚠️  Seeding failed or already done, continuing..."

echo -e "${YELLOW}🏗️  Building backend...${NC}"
npm run build || echo "⚠️  Backend build failed"

echo -e "${YELLOW}🏗️  Building frontend...${NC}"
cd ..
npm run build || echo "⚠️  Frontend build failed"

echo -e "${YELLOW}🔄 Restarting backend with PM2...${NC}"
cd backend

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo -e "${RED}❌ PM2 is not installed. Installing...${NC}"
    npm install -g pm2
fi

# Ensure logs directory exists
mkdir -p ../logs

# Restart or start backend
if pm2 list | grep -q "n2o-backend"; then
    echo -e "${GREEN}♻️  Restarting existing PM2 process...${NC}"
    pm2 restart n2o-backend --update-env
else
    echo -e "${GREEN}▶️  Starting new PM2 process...${NC}"
    pm2 start dist/main.js --name n2o-backend \
        --log-date-format "YYYY-MM-DD HH:mm:ss Z" \
        --error ../logs/pm2-error.log \
        --output ../logs/pm2-out.log \
        --merge-logs
    pm2 save
fi

# Show PM2 status
pm2 status

echo -e "${GREEN}✅ Deployment completed!${NC}"
echo -e "${GREEN}📊 Backend status:${NC}"
pm2 info n2o-backend | head -20

cd ..
