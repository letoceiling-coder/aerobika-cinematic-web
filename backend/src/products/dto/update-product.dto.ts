import { IsString, IsInt, IsOptional, IsBoolean, ValidateIf } from 'class-validator';

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

  @ValidateIf((o) => o.exchangePrice5l !== null && o.exchangePrice5l !== undefined)
  @IsInt()
  @IsOptional()
  exchangePrice5l?: number | null;

  @ValidateIf((o) => o.exchangePrice10l !== null && o.exchangePrice10l !== undefined)
  @IsInt()
  @IsOptional()
  exchangePrice10l?: number | null;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
