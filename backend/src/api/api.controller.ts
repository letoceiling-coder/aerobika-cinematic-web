import { Controller, Get, Post, Body, Query, Delete, Param, UnauthorizedException } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { OrdersService } from '../orders/orders.service';
import { UsersService } from '../users/users.service';
import { CreateOrderDto } from '../orders/dto/create-order.dto';
import { PrismaService } from '../prisma/prisma.service';
import { TelegramValidatorService } from '../telegram/telegram-validator.service';

@Controller('api')
export class ApiController {
  constructor(
    private productsService: ProductsService,
    private ordersService: OrdersService,
    private usersService: UsersService,
    private prisma: PrismaService,
    private telegramValidator: TelegramValidatorService,
  ) {}

  @Get('products')
  getProducts() {
    return this.productsService.findAll(true);
  }

  @Get('user')
  async getUser(@Query('initData') initData: string) {
    if (!initData) {
      return null;
    }

    try {
      const telegramUser = this.telegramValidator.validateInitData(initData);
      return this.usersService.findByTelegramId(telegramUser.id.toString());
    } catch (error) {
      throw new UnauthorizedException('Invalid Telegram initData');
    }
  }

  @Get('orders')
  async getUserOrders(@Query('initData') initData: string) {
    if (!initData) {
      return { data: [], total: 0 };
    }

    try {
      const telegramUser = this.telegramValidator.validateInitData(initData);
      const user = await this.usersService.findByTelegramId(telegramUser.id.toString());
      if (!user) {
        return { data: [], total: 0 };
      }
      const orders = await this.prisma.order.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
      });
      return { data: orders, total: orders.length };
    } catch (error) {
      throw new UnauthorizedException('Invalid Telegram initData');
    }
  }

  @Post('order')
  createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Post('address')
  async addAddress(@Body() body: { initData: string; address: string }) {
    try {
      const telegramUser = this.telegramValidator.validateInitData(body.initData);
      // For now, return success (addresses stored in localStorage on frontend)
      // In production, you might want to store addresses in database
      return {
        id: Date.now().toString(),
        address: body.address,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid Telegram initData');
    }
  }

  @Delete('address/:id')
  async deleteAddress(@Param('id') id: string, @Body() body: { initData: string }) {
    try {
      this.telegramValidator.validateInitData(body.initData);
      // For now, return success
      return { success: true };
    } catch (error) {
      throw new UnauthorizedException('Invalid Telegram initData');
    }
  }
}
