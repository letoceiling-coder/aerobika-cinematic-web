import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { ContentService } from './content.service';
import { UpdateContentDto } from './dto/update-content.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get()
  findAll() {
    return this.contentService.findAll();
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  update(@Body() updateContentDto: UpdateContentDto) {
    return this.contentService.update(updateContentDto);
  }
}
