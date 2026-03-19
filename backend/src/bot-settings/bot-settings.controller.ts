import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { BotSettingsService } from './bot-settings.service';
import { UpdateBotSettingDto } from './dto/update-bot-setting.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/bot-settings')
export class BotSettingsController {
  constructor(private readonly botSettingsService: BotSettingsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  findOne() {
    return this.botSettingsService.findOne();
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  update(@Body() updateBotSettingDto: UpdateBotSettingDto) {
    return this.botSettingsService.update(updateBotSettingDto);
  }
}
