import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import messages from '../../../configs/messages';
import { Plan } from '@prisma/client';

export class UpdateCourseDto {
  @ApiPropertyOptional({ example: 'Advanced NestJS' })
  @IsOptional()
  @IsString({ message: messages.MUST_BE_STRING('Title') })
  title?: string;

  @ApiPropertyOptional({ example: 'Deep dive into NestJS modules' })
  @IsOptional()
  @IsString({ message: messages.MUST_BE_STRING('Description') })
  description?: string;

  @ApiPropertyOptional({ example: 'PREMIUM', enum: Plan })
  @IsOptional()
  @IsEnum(Plan, { message: messages.INVALID_ENUM('Plan') })
  plan?: Plan;
}
