import { IsOptional, IsString } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";
import messages from "../../../configs/messages";

export class UpdateCourseDto {
  @ApiPropertyOptional({ example: "Advanced NestJS" })
  @IsOptional()
  @IsString({ message: messages.MUST_BE_STRING("Title") })
  title?: string;

  @ApiPropertyOptional({ example: "Deep dive into NestJS modules" })
  @IsOptional()
  @IsString({ message: messages.MUST_BE_STRING("Description") })  
  description?: string;
}
