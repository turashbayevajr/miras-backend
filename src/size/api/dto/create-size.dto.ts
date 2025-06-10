import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSizeDto {
  @IsString()
  @IsNotEmpty()
  label_en: string;

  @IsString()
  @IsNotEmpty()
  label_ru: string;

  @IsString()
  @IsNotEmpty()
  label_kk: string;
}
