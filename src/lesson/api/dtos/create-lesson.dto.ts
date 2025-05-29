import { IsUUID, IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import messages from '../../../configs/messages';
import { Exists } from '../../../validators/exists.validator';

export class CreateLessonDto {
  @ApiProperty({ example: 'Introduction to NestJS' })
  @IsNotEmpty({ message: messages.REQUIRED_FIELD('Title') })
  @IsString({ message: messages.MUST_BE_STRING('Title') })
  title: string;

  @ApiProperty({ example: 'This lesson explains the basics of NestJS...' })
  @IsNotEmpty({ message: messages.REQUIRED_FIELD('Content') })
  @IsString({ message: messages.MUST_BE_STRING('Content') })
  content: string;

  @ApiPropertyOptional({
    example: 'This lesson explains the basics of NestJS...',
  })
  @IsString({ message: messages.MUST_BE_STRING('Url') })
  @IsOptional()
  url?: string;

  @ApiProperty({ example: 'uuid-of-course', description: 'Course ID' })
  @IsUUID('4', { message: messages.INVALID_ID('Course ID') })
  @Exists('course', {
    message: (args) => messages.INVALID_RELATION('Course', args.value),
  })
  courseId: string;
}
