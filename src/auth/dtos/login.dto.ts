import { IsEmail, IsPhoneNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import messages from '../../configs/messages';

export class LoginDto {
  @ApiProperty({ example: '+77777777777' })
  @IsPhoneNumber("KZ", { message: messages.INVALID_FORMAT("phone") })
  phone: string;

  @ApiProperty({ example: 'StrongPass123!' })
  @IsString({ message: messages.MUST_BE_STRING('Password') })
  password: string;
}
