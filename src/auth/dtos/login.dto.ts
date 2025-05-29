import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import messages from '../../configs/messages';

export class LoginDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail({}, { message: messages.INVALID_EMAIL })
  email: string;

  @ApiProperty({ example: 'StrongPass123!' })
  @IsString({ message: messages.MUST_BE_STRING('Password') })
  password: string;
}
