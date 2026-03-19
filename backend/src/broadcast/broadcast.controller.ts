import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { BroadcastService } from './broadcast.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateBroadcastDto } from './dto/create-broadcast.dto';

@Controller('api/broadcast')
@UseGuards(JwtAuthGuard)
export class BroadcastController {
  constructor(private readonly broadcastService: BroadcastService) {}

  @Post()
  create(@Body() createBroadcastDto: CreateBroadcastDto) {
    return this.broadcastService.create(createBroadcastDto);
  }

  @Get()
  findAll() {
    return this.broadcastService.findAll();
  }

  @Post(':id/send')
  sendBroadcast(@Param('id') id: string) {
    return this.broadcastService.sendBroadcast(+id);
  }
}
