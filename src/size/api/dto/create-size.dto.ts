import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateSizeDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  label: string;
}
