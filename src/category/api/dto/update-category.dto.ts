import { IsOptional, IsString } from 'class-validator';

export class UpdateCategoryDto {
  @IsString()
  @IsOptional()
  label_en?: string;

  @IsString()
  @IsOptional()
  label_ru?: string;

  @IsString()
  @IsOptional()
  label_kk?: string;

  @IsString()
  @IsOptional()
  slug?: string;
}
