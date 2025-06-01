import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import messages from '../../../configs/messages';
import { Exists } from '../../../validators/exists.validator';
import { Plan } from '@prisma/client';

export class CourseDto {
  @ApiProperty({ example: 'NestJS for Beginners' })
  @IsNotEmpty({ message: messages.REQUIRED_FIELD('Title') })
  @IsString({ message: messages.MUST_BE_STRING('Title') })
  title: string;

  @ApiProperty({ example: 'Introductory course for NestJS' })
  @IsNotEmpty({ message: messages.REQUIRED_FIELD('Description') })
  @IsString({ message: messages.MUST_BE_STRING('Description') })
  description: string;

  @ApiProperty({
    example: 'b5a8d9f2-1234-5678-9101-abcdef123456',
    description: 'User ID',
  })
  @IsUUID('4', { message: messages.INVALID_ID('User ID') })
  @Exists('user', {
    message: (args) => messages.INVALID_RELATION('User', args.value),
  })
  creatorId: string;

  @ApiProperty({ example: 'PREMIUM', enum: Plan })
  @IsEnum(Plan, { message: messages.INVALID_ENUM('Plan') })
  plan: Plan;
}
