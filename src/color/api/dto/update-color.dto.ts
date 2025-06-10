import { IsHexColor, IsOptional, IsString } from 'class-validator';

export class UpdateColorDto {
  @IsString()
  @IsOptional()
  label_en?: string;

  @IsString()
  @IsOptional()
  label_ru?: string;

  @IsString()
  @IsOptional()
  label_kk?: string;

  @IsHexColor()
  @IsOptional()
  hex?: string;
}
