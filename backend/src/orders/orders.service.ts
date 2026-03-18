import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UsersService } from '../users/users.service';
import { TelegramService } from '../telegram/telegram.service';
import { TelegramValidatorService } from '../telegram/telegram-validator.service';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private telegramService: TelegramService,
    private telegramValidator: TelegramValidatorService,
  ) {}

  calculateDeliveryPrice(address: string): number {
    if (!address) {
      return 500; // Default if no address
    }

    // Check if address contains "Ростов-на-Дону" (case insensitive)
    const normalizedAddress = address.toLowerCase();
    if (normalizedAddress.includes('ростов-на-дону') || normalizedAddress.includes('ростов на дону')) {
      return 0;
    }

    return 500; // Default delivery price for other cities
  }

  async create(createOrderDto: CreateOrderDto) {
    const { initData, items, address, deliveryType } = createOrderDto;

    // Validate Telegram initData and extract user
    let telegramUser;
    try {
      telegramUser = this.telegramValidator.validateInitData(initData);
    } catch (error) {
      throw new UnauthorizedException('Invalid Telegram initData');
    }

    // Validation
    if (!items || items.length === 0) {
      throw new Error('Order must contain at least one item');
    }

    // Find or create user using validated telegramId
    const user = await this.usersService.findOrCreate(BigInt(telegramUser.id), {
      username: telegramUser.username,
      firstName: telegramUser.firstName,
      lastName: telegramUser.lastName,
    });

    // Calculate prices
    // If deliveryType is 'free', delivery is free
    // Otherwise, calculate based on address
    const deliveryPrice = deliveryType === 'free' ? 0 : this.calculateDeliveryPrice(address || '');
    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Create order
    const order = await this.prisma.order.create({
      data: {
        userId: user.id,
        items: items as any,
        totalPrice,
        deliveryPrice,
        address,
        status: 'new',
      },
      include: {
        user: true,
      },
    });

    // Send notification to manager
    await this.telegramService.sendOrderNotification(order);

    return order;
  }

  async findAll(page: number = 1, limit: number = 20, status?: string) {
    const skip = (page - 1) * limit;
    const where = status ? { status } : {};

    const [data, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: true,
        },
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    return this.prisma.order.update({
      where: { id },
      data: updateOrderDto,
      include: {
        user: true,
      },
    });
  }

  async remove(id: number) {
    return this.prisma.order.delete({
      where: { id },
    });
  }
}
