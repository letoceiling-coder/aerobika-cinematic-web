import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Load .env file explicitly - try multiple paths
const envPaths = [
  path.join(__dirname, '../../.env'),
  path.join(__dirname, '../../../.env'),
  '/var/www/azotrostovskiy.ru/backend/backend/.env',
  '.env',
];

for (const envPath of envPaths) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    console.log(`✅ Loaded .env from: ${envPath}`);
    break;
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: true,
  });
  
  app.enableCors({
    origin: [
      process.env.ADMIN_URL || 'http://localhost:5173',
      'http://localhost:8080',
      'http://localhost:5174',
      'https://azotrostovskiy.ru',
      'http://azotrostovskiy.ru',
      'https://www.azotrostovskiy.ru',
      'http://www.azotrostovskiy.ru',
      'https://murashun.beget.tech',
      'http://murashun.beget.tech',
      'http://murashun.beget.tech:3000',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );
  
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0'); // Listen on all interfaces (IPv4 and IPv6)
  console.log(`Server running on http://0.0.0.0:${port}`);
}

bootstrap();
