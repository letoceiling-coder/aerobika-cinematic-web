import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { TelegramValidatorService } from './telegram-validator.service';
import { TelegramController } from './telegram.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { BotSettingsModule } from '../bot-settings/bot-settings.module';

@Module({
  imports: [PrismaModule, UsersModule, BotSettingsModule],
  controllers: [TelegramController],
  providers: [TelegramService, TelegramValidatorService],
  exports: [TelegramService, TelegramValidatorService],
})
export class TelegramModule {}
