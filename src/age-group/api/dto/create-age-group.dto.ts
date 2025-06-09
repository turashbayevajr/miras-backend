import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateAgeGroupDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  label: string;
}
