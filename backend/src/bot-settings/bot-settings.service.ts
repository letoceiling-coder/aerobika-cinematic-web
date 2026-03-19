import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateBotSettingDto } from './dto/update-bot-setting.dto';

@Injectable()
export class BotSettingsService {
  constructor(private prisma: PrismaService) {}

  async findOne() {
    let settings = await this.prisma.botSetting.findFirst();
    
    // If no settings exist, create default
    if (!settings) {
      settings = await this.prisma.botSetting.create({
        data: {
          botName: 'Azot Bot',
          shortDescription: 'Бот для заказа закиси азота',
          fullDescription: 'Высококачественный продукт для профессионального использования',
          welcomeMessage: 'Добро пожаловать! Выберите товар:',
          managerChatId: '',
          telegramUsername: '',
          phone: '',
          orderTemplate: 'Новый заказ!\nТовар: {product}\nТип: {type}\nКол-во: {quantity}\nАдрес: {address}\nИмя: {name}\nТелефон: {phone}\nСумма: {total} ₽',
        },
      });
    }
    
    return settings;
  }

  async update(updateBotSettingDto: UpdateBotSettingDto) {
    let settings = await this.prisma.botSetting.findFirst();
    
    if (!settings) {
      // Create if doesn't exist
      settings = await this.prisma.botSetting.create({
        data: {
          botName: updateBotSettingDto.botName || 'Azot Bot',
          shortDescription: updateBotSettingDto.shortDescription || null,
          fullDescription: updateBotSettingDto.fullDescription || null,
          welcomeMessage: updateBotSettingDto.welcomeMessage || null,
          managerChatId: updateBotSettingDto.managerChatId || null,
          telegramUsername: updateBotSettingDto.telegramUsername || null,
          phone: updateBotSettingDto.phone || null,
          orderTemplate: updateBotSettingDto.orderTemplate || null,
        },
      });
    } else {
      // Update existing
      settings = await this.prisma.botSetting.update({
        where: { id: settings.id },
        data: updateBotSettingDto,
      });
    }
    
    return settings;
  }
}
