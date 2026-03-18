import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TelegramService } from '../telegram/telegram.service';

@Injectable()
export class BroadcastService {
  constructor(
    private prisma: PrismaService,
    private telegramService: TelegramService,
  ) {}

  async create(message: string) {
    return this.prisma.broadcast.create({
      data: { message },
    });
  }

  async findAll() {
    return this.prisma.broadcast.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async sendBroadcast(broadcastId: number) {
    const broadcast = await this.prisma.broadcast.findUnique({
      where: { id: broadcastId },
    });

    if (!broadcast || broadcast.sent) {
      throw new Error('Broadcast not found or already sent');
    }

    const users = await this.prisma.user.findMany();
    let successCount = 0;
    let failCount = 0;

    // Send with delay to avoid rate limits (30 messages per second limit)
    for (const user of users) {
      const success = await this.telegramService.sendMessage(
        typeof user.telegramId === 'string' ? Number(user.telegramId) : Number(user.telegramId),
        broadcast.message,
      );

      if (success) {
        successCount++;
      } else {
        failCount++;
      }

      // Delay 50ms between messages (20 messages per second)
      await new Promise((resolve) => setTimeout(resolve, 50));
    }

    // Mark as sent
    await this.prisma.broadcast.update({
      where: { id: broadcastId },
      data: {
        sent: true,
        sentAt: new Date(),
      },
    });

    return {
      successCount,
      failCount,
      total: users.length,
    };
  }
}
