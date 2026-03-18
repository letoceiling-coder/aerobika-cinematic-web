# 🚀 Production Deployment Guide

## Server Information
- **SSH**: murashun@chase.beget.com
- **Path**: ~/murashun.beget.tech/public_html
- **Domain**: murashun.beget.tech

---

## 📋 Step 1: Initial Server Setup (Run ONCE)

### Connect to server:
```bash
ssh murashun@chase.beget.com
```

### Run setup script:
```bash
cd ~/murashun.beget.tech/public_html
# Upload server-setup.sh to server first, then:
chmod +x server-setup.sh
./server-setup.sh
```

**OR manually:**

```bash
# 1. Install Node.js (if not installed)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm install --lts
nvm use --lts

# 2. Install PM2
npm install -g pm2

# 3. Clone repository (if not cloned)
cd ~/murashun.beget.tech/public_html
git clone <your-repo-url> .

# 4. Install dependencies
npm install
cd backend && npm install

# 5. Create .env file
nano backend/.env
# Add your environment variables (see .env.example)

# 6. Generate Prisma Client
npx prisma generate

# 7. Run migrations
npx prisma migrate deploy

# 8. Seed database
npm run prisma:seed

# 9. Build
npm run build
cd ..
npm run build

# 10. Start with PM2
cd backend
pm2 start dist/main.js --name n2o-backend
pm2 save
pm2 startup
```

---

## 📋 Step 2: Configure Environment Variables

Edit `backend/.env`:

```env
PORT=3000
NODE_ENV=production
DATABASE_URL="postgresql://user:password@localhost:5432/n2o_db?schema=public"
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"
TELEGRAM_BOT_TOKEN="your-bot-token"
TELEGRAM_MANAGER_CHAT_ID="your-chat-id"
ADMIN_URL="https://murashun.beget.tech"
```

---

## 📋 Step 3: Deploy Script Setup

### Upload deploy.sh to server:
```bash
# From your local machine
scp deploy.sh murashun@chase.beget.com:~/murashun.beget.tech/public_html/
```

### Make executable:
```bash
ssh murashun@chase.beget.com
cd ~/murashun.beget.tech/public_html
chmod +x deploy.sh
```

---

## 📋 Step 4: Deploy (Every time you need to update)

### Option A: From local machine (via SSH)
```bash
ssh murashun@chase.beget.com "cd ~/murashun.beget.tech/public_html && ./deploy.sh"
```

### Option B: Connect to server and run
```bash
ssh murashun@chase.beget.com
cd ~/murashun.beget.tech/public_html
./deploy.sh
```

---

## 📋 Step 5: Configure Web Server

### For Beget (Apache/Nginx):

Create `.htaccess` in `public_html/dist/`:

```apache
RewriteEngine On
RewriteBase /

# API proxy
RewriteCond %{REQUEST_URI} ^/api [NC]
RewriteRule ^api/(.*)$ http://localhost:3000/api/$1 [P,L]

# Auth proxy
RewriteCond %{REQUEST_URI} ^/auth [NC]
RewriteRule ^auth/(.*)$ http://localhost:3000/auth/$1 [P,L]

# Admin proxy
RewriteCond %{REQUEST_URI} ^/admin [NC]
RewriteRule ^admin/(.*)$ http://localhost:3000/admin/$1 [P,L]

# Frontend SPA
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

**OR configure nginx** (if you have access):
See `nginx.conf.example`

---

## 📋 Step 6: Verify Deployment

### Check backend:
```bash
ssh murashun@chase.beget.com
pm2 status
pm2 logs n2o-backend
```

### Check frontend:
```bash
ls -la ~/murashun.beget.tech/public_html/dist/
```

### Test API:
```bash
curl http://localhost:3000/api/products
```

### Test website:
Open: https://murashun.beget.tech

---

## 🔧 PM2 Commands

```bash
# Status
pm2 status

# Logs
pm2 logs n2o-backend

# Restart
pm2 restart n2o-backend

# Stop
pm2 stop n2o-backend

# Delete
pm2 delete n2o-backend

# Monitor
pm2 monit
```

---

## 🐛 Troubleshooting

### Backend not starting:
```bash
cd ~/murashun.beget.tech/public_html/backend
pm2 logs n2o-backend
# Check for errors
```

### Database connection error:
```bash
# Check DATABASE_URL in backend/.env
cat backend/.env | grep DATABASE_URL
```

### Port 3000 already in use:
```bash
# Find process
lsof -i :3000
# Kill it
kill -9 <PID>
# Or change PORT in .env
```

### Frontend not building:
```bash
cd ~/murashun.beget.tech/public_html
npm run build
# Check for errors
```

---

## ✅ Deployment Checklist

- [ ] Server setup completed
- [ ] Node.js installed
- [ ] PM2 installed
- [ ] Repository cloned
- [ ] Dependencies installed
- [ ] .env configured
- [ ] Database migrations run
- [ ] Backend built
- [ ] Frontend built
- [ ] PM2 process running
- [ ] Web server configured
- [ ] API accessible
- [ ] Website accessible

---

## 🚀 Quick Deploy Command

**From your local machine:**
```bash
ssh murashun@chase.beget.com "cd ~/murashun.beget.tech/public_html && ./deploy.sh"
```

**That's it! One command deploys everything.**
