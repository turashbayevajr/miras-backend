import { IsOptional, IsString, IsNumber, IsObject } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";
import messages from "../../../configs/messages";

export class UpdateSubmissionDto {
  @ApiPropertyOptional({ example: "Updated content..." })
  @IsOptional()
  @IsString({ message: messages.MUST_BE_STRING("Content") })
  content?: string;

  @ApiPropertyOptional({ example: 92.0 })
  @IsOptional()
  @IsNumber({}, { message: messages.MUST_BE_NUMBER("Score") })
  score?: number;

  @ApiPropertyOptional({ example: 85.5 })
  @IsOptional()
  @IsNumber({}, { message: messages.MUST_BE_NUMBER("Score") })
  score_test?: number;

  @ApiPropertyOptional({ example: 85.5 })
  @IsOptional()
  @IsNumber({}, { message: messages.MUST_BE_NUMBER("Score") })
  score_homework?: number;
  
    @ApiPropertyOptional({
      example: {
        'question-id-1': ['variant-id-1', 'variant-id-2'],
        'question-id-2': ['variant-id-3'],
      },
      description: 'Ответы на тест. Ключ — ID вопроса, значение — массив выбранных ID вариантов.',
      type: 'object',
      additionalProperties: {
        type: 'array',
        items: { type: 'string' },
      },
    })
    @IsOptional()
    @IsObject({ message: 'testAnswers должен быть объектом: { [questionId]: string[] }' })
    testAnswers?: Record<string, string[]>;
  
}
