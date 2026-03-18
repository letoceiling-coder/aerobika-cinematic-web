# ⚡ Быстрое развертывание

## 🚀 Одна команда для развертывания

### С локального компьютера:

```bash
ssh murashun@chase.beget.com "cd ~/murashun.beget.tech/public_html && ./deploy.sh"
```

---

## 📋 Первоначальная настройка (один раз)

### 1. Загрузить файлы на сервер:

```bash
# С локального компьютера
scp deploy.sh server-setup.sh murashun@chase.beget.com:~/murashun.beget.tech/public_html/
```

### 2. Выполнить на сервере:

```bash
ssh murashun@chase.beget.com
cd ~/murashun.beget.tech/public_html
chmod +x deploy.sh server-setup.sh
./server-setup.sh
```

### 3. Настроить .env:

```bash
nano backend/.env
```

Добавить:
```env
PORT=3000
NODE_ENV=production
DATABASE_URL="postgresql://user:password@localhost:5432/n2o_db"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"
TELEGRAM_BOT_TOKEN="your-token"
TELEGRAM_MANAGER_CHAT_ID="your-chat-id"
ADMIN_URL="https://murashun.beget.tech"
```

### 4. Перезапустить backend:

```bash
pm2 restart n2o-backend
```

---

## ✅ Готово!

Теперь для каждого обновления просто выполните:

```bash
./deploy.sh
```

Или с локального компьютера:

```bash
ssh murashun@chase.beget.com "cd ~/murashun.beget.tech/public_html && ./deploy.sh"
```

---

## 🔍 Проверка

```bash
# Статус PM2
pm2 status

# Логи
pm2 logs n2o-backend

# Тест API
curl http://localhost:3000/api/products
```
