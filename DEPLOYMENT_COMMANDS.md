# 🚀 Команды для развертывания на сервере

## Быстрая настройка (выполнить на сервере)

### 1. Первоначальная настройка (один раз):

```bash
# Подключиться к серверу
ssh murashun@chase.beget.com

# Перейти в директорию проекта
cd ~/murashun.beget.tech/public_html

# Если репозиторий еще не клонирован:
git clone https://github.com/Neeklo1606/neo-spin-win.git .

# Установить Node.js (если не установлен)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm install --lts
nvm use --lts

# Установить PM2
npm install -g pm2

# Установить зависимости
npm install
cd backend && npm install && cd ..

# Создать .env файл
nano backend/.env
# Вставьте ваши переменные окружения (см. backend/.env.example)

# Сгенерировать Prisma Client
cd backend
npx prisma generate

# Запустить миграции
npx prisma migrate deploy

# Засеять базу данных
npm run prisma:seed

# Собрать backend
npm run build

# Собрать frontend
cd ..
npm run build

# Запустить backend через PM2
cd backend
pm2 start dist/main.js --name n2o-backend
pm2 save
pm2 startup
```

---

## 2. Настройка deploy.sh

```bash
# Загрузить deploy.sh на сервер (с локального компьютера)
scp deploy.sh murashun@chase.beget.com:~/murashun.beget.tech/public_html/

# На сервере сделать исполняемым
ssh murashun@chase.beget.com
cd ~/murashun.beget.tech/public_html
chmod +x deploy.sh
```

---

## 3. Развертывание (каждый раз при обновлении)

### Вариант A: С локального компьютера одной командой

```bash
ssh murashun@chase.beget.com "cd ~/murashun.beget.tech/public_html && ./deploy.sh"
```

### Вариант B: Подключиться к серверу и выполнить

```bash
ssh murashun@chase.beget.com
cd ~/murashun.beget.tech/public_html
./deploy.sh
```

---

## 4. Проверка работы

```bash
# Проверить статус PM2
pm2 status

# Посмотреть логи
pm2 logs n2o-backend

# Проверить API
curl http://localhost:3000/api/products

# Проверить сайт
curl https://murashun.beget.tech
```

---

## 5. Настройка веб-сервера

### Для Beget (Apache):

Создайте файл `.htaccess` в `public_html/dist/`:

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

---

## 📝 Переменные окружения (backend/.env)

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

## 🔧 Полезные команды PM2

```bash
# Статус
pm2 status

# Логи
pm2 logs n2o-backend

# Перезапуск
pm2 restart n2o-backend

# Остановка
pm2 stop n2o-backend

# Удаление
pm2 delete n2o-backend

# Мониторинг
pm2 monit

# Сохранить конфигурацию
pm2 save
```

---

## ✅ Готово!

После выполнения всех шагов:
- Backend работает на порту 3000
- Frontend собран в dist/
- PM2 управляет процессом
- Развертывание одной командой: `./deploy.sh`
