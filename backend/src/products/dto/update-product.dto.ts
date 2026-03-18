import { IsString, IsInt, IsOptional, IsBoolean } from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @IsOptional()
  price5l?: number;

  @IsInt()
  @IsOptional()
  price10l?: number;

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
