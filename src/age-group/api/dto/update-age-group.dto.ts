import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateAgeGroupDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  label?: string;
}
