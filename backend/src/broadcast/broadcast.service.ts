import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TelegramService } from '../telegram/telegram.service';
import { CreateBroadcastDto } from './dto/create-broadcast.dto';

@Injectable()
export class BroadcastService {
  constructor(
    private prisma: PrismaService,
    private telegramService: TelegramService,
  ) {}

  async create(createBroadcastDto: CreateBroadcastDto) {
    return this.prisma.broadcast.create({
      data: {
        title: createBroadcastDto.title || null,
        message: createBroadcastDto.message,
        target: createBroadcastDto.target || 'all',
        status: 'draft',
      },
    });
  }

  async findAll() {
    return this.prisma.broadcast.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async sendBroadcast(id: number) {
    const broadcast = await this.prisma.broadcast.findUnique({
      where: { id },
    });

    if (!broadcast) {
      throw new Error('Broadcast not found');
    }

    if (broadcast.status === 'sent') {
      throw new Error('Broadcast already sent');
    }

    let users;
    if (broadcast.target === 'all') {
      // Send to all non-blocked users
      users = await this.prisma.user.findMany({
        where: { isBlocked: false },
      });
    } else {
      // For selected users, we need to store userIds in broadcast
      // For now, we'll send to all non-blocked users
      // TODO: Implement selected users storage
      users = await this.prisma.user.findMany({
        where: { isBlocked: false },
      });
    }

    let successCount = 0;
    let failCount = 0;

    // Send messages with delay to avoid rate limits (30 messages per second limit)
    for (const user of users) {
      const success = await this.telegramService.sendMessage(
        user.telegramId,
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

    // Update broadcast status
    await this.prisma.broadcast.update({
      where: { id },
      data: {
        status: 'sent',
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
