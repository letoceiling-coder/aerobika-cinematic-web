# Check and Setup Backend Script

Write-Host "🔍 Checking backend setup..." -ForegroundColor Cyan

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  .env file not found. Creating default .env..." -ForegroundColor Yellow
    @"
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/n2o_db?schema=public"
JWT_SECRET="n2o-delivery-super-secret-jwt-key-2024"
JWT_EXPIRES_IN="7d"
TELEGRAM_BOT_TOKEN=""
TELEGRAM_MANAGER_CHAT_ID=""
PORT=3000
NODE_ENV=development
"@ | Out-File -FilePath ".env" -Encoding utf8
    Write-Host "✅ .env file created" -ForegroundColor Green
}

# Check PostgreSQL connection
Write-Host "🔍 Checking PostgreSQL connection..." -ForegroundColor Cyan
$dbCheck = npx prisma db push --skip-generate 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Database connection successful" -ForegroundColor Green
} else {
    Write-Host "❌ Database connection failed. Please ensure PostgreSQL is running." -ForegroundColor Red
    Write-Host "   You can start PostgreSQL service or use Docker:" -ForegroundColor Yellow
    Write-Host "   docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=postgres postgres" -ForegroundColor Yellow
    exit 1
}

# Generate Prisma Client
Write-Host "🔍 Generating Prisma Client..." -ForegroundColor Cyan
npx prisma generate
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Prisma Client generated" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to generate Prisma Client" -ForegroundColor Red
    exit 1
}

# Run migrations
Write-Host "🔍 Running database migrations..." -ForegroundColor Cyan
npx prisma migrate dev --name init --skip-seed
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Migrations completed" -ForegroundColor Green
} else {
    Write-Host "⚠️  Migrations failed, trying db push..." -ForegroundColor Yellow
    npx prisma db push --skip-generate
}

# Seed database
Write-Host "🔍 Seeding database..." -ForegroundColor Cyan
npm run prisma:seed
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Database seeded" -ForegroundColor Green
} else {
    Write-Host "⚠️  Seeding failed, but continuing..." -ForegroundColor Yellow
}

Write-Host "✅ Setup completed!" -ForegroundColor Green
