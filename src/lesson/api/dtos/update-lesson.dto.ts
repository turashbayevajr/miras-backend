import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import messages from '../../../configs/messages';

export class UpdateLessonDto {
  @ApiPropertyOptional({ example: 'Updated lesson title' })
  @IsOptional()
  @IsString({ message: messages.MUST_BE_STRING('Title') })
  title?: string;

  @ApiPropertyOptional({ example: 'Updated content' })
  @IsOptional()
  @IsString({ message: messages.MUST_BE_STRING('Content') })
  content?: string;

  @ApiPropertyOptional({
    example: 'This lesson explains the basics of NestJS...',
  })
  @IsString({ message: messages.MUST_BE_STRING('Content') })
  @IsOptional()
  url?: string;
}
