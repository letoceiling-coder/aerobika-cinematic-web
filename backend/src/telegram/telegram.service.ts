import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Telegraf } from 'telegraf';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TelegramService implements OnModuleInit {
  private bot: Telegraf;

  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
    private prisma: PrismaService,
  ) {
    const token = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    if (token) {
      this.bot = new Telegraf(token);
    }
  }

  async onModuleInit() {
    if (this.bot) {
      this.setupBot();
      await this.bot.launch();
      console.log('🤖 Telegram bot started');
    }
  }

  private setupBot() {
    // /start command
    this.bot.start(async (ctx) => {
      const user = ctx.from;
      await this.usersService.findOrCreate(BigInt(user.id), {
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name,
      });

      await ctx.reply(
        '👋 Добро пожаловать! Используйте Mini App для заказа товаров.',
      );
    });

    // /catalog command
    this.bot.command('catalog', async (ctx) => {
      const products = await this.prisma.product.findMany({
        where: { isActive: true },
      });

      if (products.length === 0) {
        await ctx.reply('📦 Каталог пуст');
        return;
      }

      let message = '📦 Каталог товаров:\n\n';
      products.forEach((product) => {
        message += `• ${product.name}\n`;
        message += `  5л: ${product.price5l} ₽\n`;
        message += `  10л: ${product.price10l} ₽\n\n`;
      });

      await ctx.reply(message);
    });
  }

  async sendOrderNotification(order: any) {
    if (!this.bot) return;

    const managerChatId = this.configService.get<string>('TELEGRAM_MANAGER_CHAT_ID');
    if (!managerChatId) return;

    // Parse items (can be JSON string or array)
    let items = [];
    try {
      items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
      if (!Array.isArray(items)) items = [];
    } catch {
      items = [];
    }

    // Format items according to specification
    // Each item shows: [name] [volume] x [qty]
    // Support multiple items
    const itemsLines = items.map((item: any) => {
      return `${item.name} ${item.volume} x${item.quantity}`;
    });
    const itemsText = itemsLines.join('\n');
    
    // Type: show per item (each item can have different type)
    // Format: "Покупка" or "Обмен" or "Покупка, Обмен" if mixed
    const types = items.map((item: any) => item.type === 'exchange' ? 'Обмен' : 'Покупка');
    const uniqueTypes = [...new Set(types)];
    const typeText = uniqueTypes.length === 1 ? uniqueTypes[0] : uniqueTypes.join(' / ');

    // Delivery text
    const deliveryText = order.deliveryPrice === 0 
      ? 'По Ростову' 
      : 'За пределами';

    // Build message EXACTLY as specified
    const message = `Новый заказ!\n` +
      `Товар: ${itemsText}\n` +
      `Тип: ${typeText}\n` +
      `Доставка: ${deliveryText}\n` +
      `Адрес: ${order.address || 'Не указан'}\n` +
      `Имя: ${order.name || order.user.firstName || 'Не указано'}\n` +
      `Телефон: ${order.phone || order.user.phone || 'Не указан'}\n` +
      `Сумма: ${order.totalPrice + order.deliveryPrice} ₽`;

    try {
      await this.bot.telegram.sendMessage(managerChatId, message);
    } catch (error) {
      console.error('Failed to send order notification:', error);
    }
  }

  async sendMessage(chatId: number, message: string) {
    if (!this.bot) return false;

    try {
      await this.bot.telegram.sendMessage(chatId, message);
      return true;
    } catch (error) {
      console.error(`Failed to send message to ${chatId}:`, error);
      return false;
    }
  }
}
