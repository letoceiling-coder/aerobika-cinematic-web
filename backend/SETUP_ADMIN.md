# Setup Admin User

## Quick Setup

1. **Ensure database is running and migrated:**
```bash
cd backend
npx prisma generate
npx prisma migrate dev
```

2. **Run seed script to create admin user:**
```bash
npm run prisma:seed
```

This will create:
- Email: `dsc-23@yandex.ru`
- Password: `123123123`
- Name: `Джон Уик`
- Role: `admin`

3. **Start backend:**
```bash
npm run start:dev
```

Backend will run on `http://localhost:3000`

## Verify Admin User

You can verify the admin user was created by:

1. **Using Prisma Studio:**
```bash
npm run prisma:studio
```

2. **Or check directly in database:**
```sql
SELECT * FROM admin_users WHERE email = 'dsc-23@yandex.ru';
```

## Troubleshooting

### Connection Refused Error

If you see "connection refused" error:
1. Make sure backend is running: `npm run start:dev`
2. Check backend is on port 3000
3. Verify CORS is configured correctly (should allow `http://localhost:8080`)

### Admin User Not Found

If login fails with "Invalid credentials":
1. Run seed script: `npm run prisma:seed`
2. Verify user exists in database
3. Check password is hashed (not plain text)

### Database Connection Error

If you see database connection errors:
1. Check `.env` file exists with `DATABASE_URL`
2. Verify PostgreSQL is running
3. Check database credentials are correct
