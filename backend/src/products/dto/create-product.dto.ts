import { IsString, IsInt, IsOptional, IsBoolean } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  price5l: number;

  @IsInt()
  price10l: number;

  @IsInt()
  @IsOptional()
  exchangePrice5l?: number;

  @IsInt()
  @IsOptional()
  exchangePrice10l?: number;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
