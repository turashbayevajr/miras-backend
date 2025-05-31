import { IsBoolean, IsNumber, IsOptional, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import messages from '../../../configs/messages';
import { Exists } from '../../../validators/exists.validator';
import { Transform } from 'class-transformer';

export class UpdateEnrollmentDto {
  @ApiPropertyOptional({ example: 'uuid' })
  @IsOptional()
  @IsUUID('4', { message: messages.INVALID_ID('User ID') })
  @Exists('user', {
    message: (args) => messages.INVALID_RELATION('User', args.value),
  })
  userId?: string;

  @ApiPropertyOptional({ example: 'uuid' })
  @IsOptional()
  @IsUUID('4', { message: messages.INVALID_ID('Course ID') })
  @Exists('course', {
    message: (args) => messages.INVALID_RELATION('Course', args.value),
  })
  courseId?: string;

  @ApiPropertyOptional({
    example: false,
    description: 'Status of discount (true or false)',
  })
  @IsBoolean({ message: messages.MUST_BE_BOOLEAN('Is Active') })
  @Transform(({ value }) => value === 'false' || value === false)
  is_approved?: boolean;


  @ApiPropertyOptional({ example: 85.5 })
  @IsOptional()
  @IsNumber({}, { message: messages.MUST_BE_NUMBER('Score') })
  overallProgress?: number;
}
