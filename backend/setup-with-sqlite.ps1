# Setup Backend with SQLite (when PostgreSQL is not available)

Write-Host "🔧 Setting up backend with SQLite..." -ForegroundColor Cyan

# Backup original schema
if (Test-Path "prisma\schema.prisma") {
    Copy-Item "prisma\schema.prisma" "prisma\schema.postgresql.prisma.backup"
    Write-Host "✅ Backed up PostgreSQL schema" -ForegroundColor Green
}

# Use SQLite schema
if (Test-Path "prisma\schema.sqlite.prisma") {
    Copy-Item "prisma\schema.sqlite.prisma" "prisma\schema.prisma"
    Write-Host "✅ Using SQLite schema" -ForegroundColor Green
}

# Generate Prisma Client
Write-Host "🔍 Generating Prisma Client..." -ForegroundColor Cyan
npx prisma generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to generate Prisma Client" -ForegroundColor Red
    exit 1
}

# Create database and run migrations
Write-Host "🔍 Creating database..." -ForegroundColor Cyan
npx prisma migrate dev --name init
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Migrations failed, trying db push..." -ForegroundColor Yellow
    npx prisma db push
}

# Seed database
Write-Host "🔍 Seeding database..." -ForegroundColor Cyan
npm run prisma:seed
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Database seeded successfully" -ForegroundColor Green
} else {
    Write-Host "⚠️  Seeding had issues, but continuing..." -ForegroundColor Yellow
}

Write-Host "✅ SQLite setup completed!" -ForegroundColor Green
Write-Host "📝 Note: This is a temporary SQLite setup. For production, use PostgreSQL." -ForegroundColor Yellow
