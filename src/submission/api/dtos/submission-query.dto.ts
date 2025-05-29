import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsDateString } from 'class-validator';
import messages from '../../../configs/messages';
import { Exists } from '../../../validators/exists.validator';


export class SubmissionQueryDto {
  @ApiPropertyOptional({ example: 'clx9kav8d002', description: 'User ID' })
  @IsOptional()
  @IsString({ message: messages.MUST_BE_STRING('User ID') })
  @Exists('user', {
    message: args => messages.INVALID_RELATION('User', args.value),
  })
  userId?: string;

  @ApiPropertyOptional({ example: 'clx9kar58003', description: 'Lesson ID' })
  @IsOptional()
  @IsString({ message: messages.MUST_BE_STRING('Lesson ID') })
  @Exists('lesson', {
    message: args => messages.INVALID_RELATION('Lesson', args.value),
  })
  lessonId?: string;
  
  @ApiPropertyOptional({ example: 'clx9kar58003', description: 'Course ID' })
  @IsOptional()
  @IsString({ message: messages.MUST_BE_STRING('Course ID') })
  @Exists('course', {
    message: args => messages.INVALID_RELATION('Course', args.value),
  })
  courseId?: string;
  @ApiPropertyOptional({ example: '2024-05-01T00:00:00.000Z', description: 'Start date (ISO format)' })
  @IsOptional()
  @IsDateString({}, { message: messages.MUST_BE_DATE('Start date') })
  startDate?: string;

  @ApiPropertyOptional({ example: '2024-05-31T23:59:59.999Z', description: 'End date (ISO format)' })
  @IsOptional()
  @IsDateString({}, { message: messages.MUST_BE_DATE('End date') })
  endDate?: string;
}
