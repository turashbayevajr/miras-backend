import { IsOptional, IsString } from 'class-validator';

export class UpdateSizeDto {
  @IsString()
  @IsOptional()
  label_en?: string;

  @IsString()
  @IsOptional()
  label_ru?: string;

  @IsString()
  @IsOptional()
  label_kk?: string;
}
