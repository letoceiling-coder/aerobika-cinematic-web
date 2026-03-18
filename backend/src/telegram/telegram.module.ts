import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { TelegramValidatorService } from './telegram-validator.service';
import { TelegramController } from './telegram.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [PrismaModule, UsersModule],
  controllers: [TelegramController],
  providers: [TelegramService, TelegramValidatorService],
  exports: [TelegramService, TelegramValidatorService],
})
export class TelegramModule {}
