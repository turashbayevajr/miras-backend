import { IsOptional, IsString } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";
import messages from "../../../configs/messages";

export class UpdateHomeworkDto {
  @ApiPropertyOptional({ example: "Updated Homework Title" })
  @IsOptional()
  @IsString({ message: messages.MUST_BE_STRING("Title") })
  title?: string;

  @ApiPropertyOptional({ example: "Updated homework content..." })
  @IsOptional()
  @IsString({ message: messages.MUST_BE_STRING("Content") })
  content?: string;
}
