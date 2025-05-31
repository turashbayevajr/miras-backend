import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsOptional,
  IsNumber,
  IsObject,
  IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import messages from '../../../configs/messages';
import { Exists } from '../../../validators/exists.validator';
import { Transform } from 'class-transformer';

export class CreateSubmissionDto {
  @ApiProperty({ example: 'uuid-of-user' })
  @IsUUID('4', { message: messages.INVALID_ID('User ID') })
  @Exists('user', {
    message: (args) => messages.INVALID_RELATION('User', args.value),
  })
  userId: string;

  @ApiPropertyOptional({ example: 'uuid-of-homework' })
  @IsOptional()
  @IsUUID('4', { message: messages.INVALID_ID('Homework ID') })
  @Exists('homework', {
    message: (args) => messages.INVALID_RELATION('Homework', args.value),
  })
  homeworkId?: string;

  @ApiPropertyOptional({ example: 'uuid-of-test' })
  @IsOptional()
  @IsUUID('4', { message: messages.INVALID_ID('Test ID') })
  @Exists('test', {
    message: (args) => messages.INVALID_RELATION('Test', args.value),
  })
  testId?: string;

  @ApiProperty({ example: 'Answer content or JSON result' })
  @IsNotEmpty({ message: messages.REQUIRED_FIELD('Content') })
  @IsString({ message: messages.MUST_BE_STRING('Content') })
  content: string;

  @ApiPropertyOptional({ example: 85.5 })
  @IsOptional()
  @IsNumber({}, { message: messages.MUST_BE_NUMBER('Score') })
  score?: number;

  @ApiPropertyOptional({ example: 85.5 })
  @IsOptional()
  @IsNumber({}, { message: messages.MUST_BE_NUMBER('Score') })
  score_test?: number;

  @ApiPropertyOptional({ example: 85.5 })
  @IsOptional()
  @IsNumber({}, { message: messages.MUST_BE_NUMBER('Score') })
  score_homework?: number;

  @ApiPropertyOptional({
    example: {
      'question-id-1': ['variant-id-1', 'variant-id-2'],
      'question-id-2': ['variant-id-3'],
    },
    description:
      'Ответы на тест. Ключ — ID вопроса, значение — массив выбранных ID вариантов.',
    type: 'object',
    additionalProperties: {
      type: 'array',
      items: { type: 'string' },
    },
  })
  @IsOptional()
  @IsObject({
    message: 'testAnswers должен быть объектом: { [questionId]: string[] }',
  })
  testAnswers?: Record<string, string[]>;

  @ApiPropertyOptional({
    example: false,
    description: 'Status of discount (true or false)',
  })
  @IsOptional()
  @IsBoolean({ message: messages.MUST_BE_BOOLEAN('Is Active') })
  @Transform(({ value }) => value === 'false' || value === false)
  passed?: boolean;
}
