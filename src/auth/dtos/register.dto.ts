import {
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import messages from '../../configs/messages';
import { Role } from '@prisma/client';

export class RegisterDto {
  @ApiProperty({ example: 'John Doe' })
  @IsNotEmpty({ message: messages.REQUIRED_FIELD('Full name') })
  @IsString({ message: messages.MUST_BE_STRING('Full name') })
  fullName: string;

  @ApiProperty({ example: '+77777777777' })
  @IsPhoneNumber("KZ", { message: messages.INVALID_FORMAT("phone") })
  phone: string;

  @ApiProperty({ example: 'StrongPassword123!' })
  @IsString({ message: messages.MUST_BE_STRING('Password') })
  @MinLength(6, { message: messages.MIN_LENGTH('Password', 6) })
  password: string;

  @ApiProperty({ enum: Role })
  @IsEnum(Role, { message: messages.INVALID_ENUM('Role') })
  role: Role;
}
