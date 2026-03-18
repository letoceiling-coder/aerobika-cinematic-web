import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { ProductsModule } from '../products/products.module';
import { OrdersModule } from '../orders/orders.module';
import { UsersModule } from '../users/users.module';
import { PrismaModule } from '../prisma/prisma.module';
import { TelegramModule } from '../telegram/telegram.module';

@Module({
  imports: [ProductsModule, OrdersModule, UsersModule, PrismaModule, TelegramModule],
  controllers: [ApiController],
})
export class ApiModule {}
