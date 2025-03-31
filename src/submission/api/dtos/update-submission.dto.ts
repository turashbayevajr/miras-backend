import { IsOptional, IsString, IsNumber } from "class-validator";
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
}
