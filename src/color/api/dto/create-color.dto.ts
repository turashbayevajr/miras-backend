import { IsHexColor, IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class CreateColorDto {
  @IsString()
  @IsNotEmpty()
  label_en: string;

  @IsString()
  @IsNotEmpty()
  label_ru: string;

  @IsString()
  @IsNotEmpty()
  label_kk: string;

  @IsHexColor()
  @IsOptional()
  hex?: string;
}
