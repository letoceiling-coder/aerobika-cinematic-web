import { IsString, IsOptional } from 'class-validator';

export class UpdateBotSettingDto {
  @IsString()
  @IsOptional()
  botName?: string;

  @IsString()
  @IsOptional()
  shortDescription?: string;

  @IsString()
  @IsOptional()
  fullDescription?: string;

  @IsString()
  @IsOptional()
  welcomeMessage?: string;

  @IsString()
  @IsOptional()
  managerChatId?: string;

  @IsString()
  @IsOptional()
  telegramUsername?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  orderTemplate?: string;
}
