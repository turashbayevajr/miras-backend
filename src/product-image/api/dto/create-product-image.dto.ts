import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';

export class CreateProductImageDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsUrl()
  @IsNotEmpty()
  url: string;

  @IsOptional()
  @IsString()
  alt?: string;

  @IsInt()
  @Min(0)
  position: number;

  @IsBoolean()
  isPrimary: boolean;
}
