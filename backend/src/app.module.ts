import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { BotSettingsModule } from './bot-settings/bot-settings.module';
import { OrdersModule } from './orders/orders.module';
import { TelegramModule } from './telegram/telegram.module';
import { BroadcastModule } from './broadcast/broadcast.module';
import { AdminModule } from './admin/admin.module';
import { ApiModule } from './api/api.module';
import { ContentModule } from './content/content.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../.env', '../../.env'],
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    BotSettingsModule,
    ApiModule, // Register before OrdersModule to handle /api/orders first
    OrdersModule,
    TelegramModule,
    BroadcastModule,
    AdminModule,
    ContentModule,
  ],
})
export class AppModule {}
