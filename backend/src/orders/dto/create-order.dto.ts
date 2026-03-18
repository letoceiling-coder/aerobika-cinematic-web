import { IsArray, IsInt, IsString, IsOptional, IsEnum, ValidateNested, ArrayMinSize, Min } from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
  @IsString()
  name: string;

  @IsString()
  volume: string;

  @IsString()
  type: string;

  @IsInt()
  @Min(1)
  price: number;

  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @IsString()
  initData: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'Order must contain at least one item' })
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsEnum(['free', 'paid'])
  deliveryType: 'free' | 'paid';
}
