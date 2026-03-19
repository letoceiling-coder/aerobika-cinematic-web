import { Module } from '@nestjs/common';
import { BotSettingsController } from './bot-settings.controller';
import { BotSettingsService } from './bot-settings.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BotSettingsController],
  providers: [BotSettingsService],
  exports: [BotSettingsService],
})
export class BotSettingsModule {}
