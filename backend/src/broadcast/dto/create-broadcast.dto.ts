import { IsString, IsOptional, IsArray, IsIn } from 'class-validator';

export class CreateBroadcastDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  message: string;

  @IsString()
  @IsIn(['all', 'selected'])
  target: 'all' | 'selected';

  @IsArray()
  @IsOptional()
  userIds?: number[];
}
