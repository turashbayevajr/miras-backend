import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateSizeDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  label?: string;
}
