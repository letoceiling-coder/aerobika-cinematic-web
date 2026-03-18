#!/bin/bash
# Initial server setup script
# Run this ONCE on the server to set up everything

set -e

echo "🔧 Setting up production server..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Installing Node.js via nvm..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    nvm install --lts
    nvm use --lts
fi

NODE_VERSION=$(node -v)
echo -e "${GREEN}✅ Node.js version: $NODE_VERSION${NC}"

# Install PM2 globally
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}📦 Installing PM2...${NC}"
    npm install -g pm2
else
    echo -e "${GREEN}✅ PM2 already installed${NC}"
fi

# Navigate to project directory
PROJECT_DIR="$HOME/murashun.beget.tech/public_html"
if [ ! -d "$PROJECT_DIR" ]; then
    echo -e "${YELLOW}📁 Creating project directory...${NC}"
    mkdir -p "$PROJECT_DIR"
fi

cd "$PROJECT_DIR"

# Clone repository if not exists
if [ ! -d ".git" ]; then
    echo -e "${YELLOW}📥 Cloning repository...${NC}"
    echo "Please clone your repository manually or run:"
    echo "git clone <your-repo-url> ."
    read -p "Press Enter after cloning repository..."
fi

# Install dependencies
echo -e "${YELLOW}📦 Installing root dependencies...${NC}"
npm install

echo -e "${YELLOW}📦 Installing backend dependencies...${NC}"
cd backend
npm install

# Generate Prisma Client
echo -e "${YELLOW}🔧 Generating Prisma Client...${NC}"
npx prisma generate

# Create .env file if not exists
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}📝 Creating .env file...${NC}"
    cat > .env << EOF
PORT=3000
NODE_ENV=production
DATABASE_URL="postgresql://user:password@localhost:5432/n2o_db?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this"
JWT_EXPIRES_IN="7d"
TELEGRAM_BOT_TOKEN=""
TELEGRAM_MANAGER_CHAT_ID=""
ADMIN_URL="https://murashun.beget.tech"
EOF
    echo -e "${GREEN}✅ .env file created. Please edit it with your values!${NC}"
fi

# Run migrations
echo -e "${YELLOW}🗄️  Running database migrations...${NC}"
npx prisma migrate deploy || echo "⚠️  Migrations failed, check DATABASE_URL"

# Seed database
echo -e "${YELLOW}🌱 Seeding database...${NC}"
npm run prisma:seed || echo "⚠️  Seeding failed or already done"

# Build backend
echo -e "${YELLOW}🏗️  Building backend...${NC}"
npm run build

# Build frontend
echo -e "${YELLOW}🏗️  Building frontend...${NC}"
cd ..
npm run build

# Setup PM2
cd backend
echo -e "${YELLOW}🚀 Setting up PM2...${NC}"
pm2 start dist/main.js --name n2o-backend --log-date-format "YYYY-MM-DD HH:mm:ss Z"
pm2 save
pm2 startup

echo -e "${GREEN}✅ Server setup completed!${NC}"
echo -e "${GREEN}📊 PM2 status:${NC}"
pm2 status

echo ""
echo -e "${YELLOW}⚠️  IMPORTANT:${NC}"
echo "1. Edit backend/.env with your actual values"
echo "2. Restart backend: pm2 restart n2o-backend"
echo "3. Configure nginx/web server to serve frontend from dist/"
echo "4. Configure nginx to proxy /api requests to http://localhost:3000"
