import { IsOptional, IsString, Matches, MaxLength } from 'class-validator';

export class UpdateColorDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  label?: string;

  @IsOptional()
  @IsString()
  @Matches(/^#([0-9a-fA-F]{3}){1,2}$/, { message: 'Hex must be a valid color code' })
  hex?: string;
}
