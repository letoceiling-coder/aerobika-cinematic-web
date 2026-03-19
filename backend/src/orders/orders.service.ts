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
    const { initData, items, address, deliveryType, name, phone } = createOrderDto;

    console.log('📦 Creating order:', { 
      itemsCount: items?.length, 
      address, 
      name, 
      phone,
      hasInitData: !!initData,
      initDataLength: initData?.length 
    });

    // Validation
    if (!items || items.length === 0) {
      console.error('❌ Order validation failed: no items');
      throw new Error('Order must contain at least one item');
    }

    // Handle user: Telegram Mini App or Web version
    let user;
    if (initData) {
      // Telegram Mini App: validate and use Telegram user
      try {
        const telegramUser = this.telegramValidator.validateInitData(initData);
        console.log('✅ Telegram user validated:', telegramUser.id);
        user = await this.usersService.findOrCreate(telegramUser.id.toString(), {
          username: telegramUser.username,
          firstName: telegramUser.firstName,
          lastName: telegramUser.lastName,
          phone: phone || (telegramUser as any).phone,
        });
        console.log('✅ User found/created from Telegram:', user.id);
      } catch (error: any) {
        console.error('❌ Invalid Telegram initData:', error.message);
        throw new UnauthorizedException('Invalid Telegram initData');
      }
    } else {
      // Web version: create/find user by phone or create anonymous user
      if (phone) {
        // Try to find user by phone
        const existingUser = await this.prisma.user.findFirst({
          where: { phone },
        });
        if (existingUser) {
          user = existingUser;
          console.log('✅ User found by phone:', user.id);
        } else {
          // Create new user with phone
          user = await this.prisma.user.create({
            data: {
              telegramId: `web_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              phone,
              firstName: name || null,
            },
          });
          console.log('✅ New user created for web order:', user.id);
        }
      } else {
        // Anonymous web order - create temporary user
        user = await this.prisma.user.create({
          data: {
            telegramId: `web_anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            firstName: name || 'Анонимный',
            phone: phone || null,
          },
        });
        console.log('✅ Anonymous user created for web order:', user.id);
      }
    }

    // Calculate delivery price - BACKEND IS SOURCE OF TRUTH
    // Priority: 1) deliveryType from frontend, 2) address check
    // If deliveryType is "free" OR address contains "Ростов" (case insensitive) → delivery = 0
    // Otherwise → delivery = 500
    let finalDeliveryPrice = 500;
    
    if (deliveryType === 'free') {
      finalDeliveryPrice = 0;
      console.log('✅ Free delivery based on deliveryType');
    } else if (address && address.toLowerCase().includes('ростов')) {
      finalDeliveryPrice = 0;
      console.log('✅ Free delivery based on address (contains "Ростов")');
    } else {
      finalDeliveryPrice = 500;
      console.log('💰 Paid delivery: 500 ₽');
    }
    
    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    console.log('💰 Order totals:', { totalPrice, deliveryPrice: finalDeliveryPrice });

    // Create order
    const order = await this.prisma.order.create({
      data: {
        userId: user.id,
        items: JSON.stringify(items),
        totalPrice,
        deliveryPrice: finalDeliveryPrice,
        address,
        name,
        phone,
        status: 'new',
      },
      include: {
        user: true,
      },
    });

    console.log('✅ Order created:', order.id);

    // Send notification to manager
    try {
      await this.telegramService.sendOrderNotification(order);
      console.log('✅ Order notification sent');
    } catch (error: any) {
      console.error('⚠️ Failed to send notification:', error.message);
      // Don't fail order creation if notification fails
    }

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
