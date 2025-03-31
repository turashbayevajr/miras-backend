import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import messages from '../../configs/messages';

export enum Role {
  ADMIN = "ADMIN",
  TEACHER = "TEACHER",
  STUDENT = "STUDENT",
}

export enum Plan {
  STANDARD = "STANDARD",
  PREMIUM = "PREMIUM",
  ENTERPRISE = "ENTERPRISE",
}

export class RegisterDto {
  @ApiProperty({ example: "John Doe" })
  @IsNotEmpty({ message: messages.REQUIRED_FIELD("Full name") })
  @IsString({ message: messages.MUST_BE_STRING("Full name") })
  fullName: string;

  @ApiProperty({ example: "john@example.com" })
  @IsEmail({}, { message: messages.INVALID_EMAIL })
  email: string;

  @ApiProperty({ example: "StrongPassword123!" })
  @IsString({ message: messages.MUST_BE_STRING("Password") })
  @MinLength(6, { message: messages.MIN_LENGTH("Password", 6) })
  password: string;

  @ApiProperty({ enum: Role })
  @IsEnum(Role, { message: messages.INVALID_ENUM("Role") })
  role: Role;

  @ApiProperty({ enum: Plan })
  @IsEnum(Plan, { message: messages.INVALID_ENUM("Plan") })
  plan: Plan;
}
