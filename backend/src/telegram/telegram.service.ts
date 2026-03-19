import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Telegraf } from 'telegraf';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service';
import { BotSettingsService } from '../bot-settings/bot-settings.service';

@Injectable()
export class TelegramService implements OnModuleInit {
  private bot: Telegraf;

  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
    private prisma: PrismaService,
    private botSettingsService: BotSettingsService,
  ) {
    // Try multiple ways to get token
    const token = 
      this.configService.get<string>('TELEGRAM_BOT_TOKEN') ||
      process.env.TELEGRAM_BOT_TOKEN;
    if (token) {
      this.bot = new Telegraf(token);
    }
  }

  async onModuleInit() {
    if (this.bot) {
      // Launch bot asynchronously to not block server startup
      this.setupBot();
      this.bot.launch({
        dropPendingUpdates: true,
      }).then(() => {
        console.log('🤖 Telegram bot started with polling');
      }).catch((error: any) => {
        console.warn('⚠️ Telegram bot failed to start:', error.message);
        console.warn('⚠️ Continuing without Telegram bot functionality');
      });
    } else {
      console.warn('⚠️ TELEGRAM_BOT_TOKEN not set, Telegram bot disabled');
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

      // Get bot settings from admin panel
      const settings = await this.botSettingsService.findOne();
      
      // Use welcomeMessage from settings, fallback to default
      const welcomeText = settings.welcomeMessage || 
        '👋 Добро пожаловать! Используйте Mini App для заказа товаров.';
      
      // Mini App URL
      const miniAppUrl = 'https://azotrostovskiy.ru';

      await ctx.reply(
        welcomeText,
        {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: '🛒 Открыть каталог',
                  web_app: { url: miniAppUrl },
                },
              ],
            ],
          },
        },
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
    if (!this.bot) {
      console.warn('⚠️ Telegram bot not initialized, cannot send notification');
      return;
    }

    // Get managerChatId from BotSettings (configured in admin panel)
    let managerChatId: string | null = null;
    try {
      const botSettings = await this.botSettingsService.findOne();
      managerChatId = botSettings.managerChatId;
    } catch (error) {
      console.error('⚠️ Failed to get bot settings:', error);
    }

    // Fallback to env variable if not set in admin
    if (!managerChatId) {
      managerChatId = this.configService.get<string>('TELEGRAM_MANAGER_CHAT_ID') || null;
    }

    if (!managerChatId || managerChatId.trim() === '') {
      console.warn('⚠️ Manager Chat ID not configured, skipping notification');
      return;
    }

    // Parse items (can be JSON string or array)
    let items = [];
    try {
      items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
      if (!Array.isArray(items)) items = [];
    } catch {
      items = [];
    }

    if (items.length === 0) {
      console.warn('⚠️ Order has no items, skipping notification');
      return;
    }

    // Format items according to specification
    // Format: [name] [volume] x [qty] (for cylinders)
    // Format: [name] x [qty] (for non-cylinders)
    // If multiple items, show each on new line after "Товар:"
    const itemsLines = items.map((item: any) => {
      const productType = item.productType || 'cylinder';
      const itemName = item.name || 'Товар';
      const quantity = item.quantity || 1;
      
      if (productType === 'cylinder' && item.volume) {
        // Cylinder: show volume
        return `${itemName} ${item.volume} x${quantity}`;
      } else {
        // Non-cylinder: no volume
        return `${itemName} x${quantity}`;
      }
    });
    
    // Build items text: single item on same line, multiple items on separate lines
    let itemsText: string;
    if (itemsLines.length === 1) {
      itemsText = itemsLines[0];
    } else {
      // Multiple items: each on new line with indentation
      itemsText = itemsLines.join('\n');
    }
    
    // Type: show per item (each item can have different type)
    // Format: "Покупка" or "Обмен" or "Покупка / Обмен" if mixed
    const types = items.map((item: any) => item.type === 'exchange' ? 'Обмен' : 'Покупка');
    const uniqueTypes = [...new Set(types)];
    const typeText = uniqueTypes.length === 1 ? uniqueTypes[0] : uniqueTypes.join(' / ');

    // Delivery text: "По Ростову" if deliveryPrice is 0 (inside city), "За пределами" otherwise
    const deliveryText = order.deliveryPrice === 0 
      ? 'По Ростову' 
      : 'За пределами';

    // Get user info (from order or user relation)
    const userName = order.name || (order.user?.firstName || null);
    const userPhone = order.phone || (order.user?.phone || null);

    // Calculate total sum
    const totalSum = order.totalPrice + order.deliveryPrice;

    // Build message EXACTLY as specified
    // Format:
    // Новый заказ!
    // Товар: [название] [объём] x [кол-во]
    // Тип: Покупка / Обмен
    // Доставка: По Ростову / За пределами
    // Адрес: [адрес]
    // Имя: [имя]
    // Телефон: [телефон]
    // Сумма: [итого] ₽
    let message = 'Новый заказ!\n';
    message += `Товар: ${itemsText}\n`;
    message += `Тип: ${typeText}\n`;
    message += `Доставка: ${deliveryText}\n`;
    message += `Адрес: ${order.address || 'Не указан'}\n`;
    message += `Имя: ${userName || 'Не указано'}\n`;
    message += `Телефон: ${userPhone || 'Не указан'}\n`;
    message += `Сумма: ${totalSum} ₽`;

    try {
      await this.bot.telegram.sendMessage(managerChatId, message);
      console.log(`✅ Order notification sent to manager (Chat ID: ${managerChatId})`);
    } catch (error: any) {
      console.error('❌ Failed to send order notification:', error.message);
      // Don't throw - order creation should succeed even if notification fails
    }
  }

  /**
   * Send message to specific chat ID
   * Used for broadcasts and notifications
   */
  async sendMessage(chatId: string | number, text: string): Promise<boolean> {
    if (!this.bot) {
      console.warn('⚠️ Telegram bot not initialized, cannot send message');
      return false;
    }

    try {
      // Convert string to number if needed
      const chatIdNum = typeof chatId === 'string' ? Number(chatId) : chatId;
      await this.bot.telegram.sendMessage(chatIdNum, text, { parse_mode: 'HTML' });
      return true;
    } catch (error: any) {
      // Log error but don't throw - user might have blocked bot
      console.error(`❌ Failed to send message to ${chatId}:`, error.message);
      return false;
    }
  }
}
