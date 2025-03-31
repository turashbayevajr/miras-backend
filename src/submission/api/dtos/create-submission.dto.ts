import { IsNotEmpty, IsString, IsUUID, IsOptional, IsNumber } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import messages from "../../../configs/messages";
import { Exists } from "../../../validators/exists.validator";

export class CreateSubmissionDto {
  @ApiProperty({ example: "uuid-of-user" })
  @IsUUID("4", { message: messages.INVALID_ID("User ID") })
  @Exists("user", { message: args => messages.INVALID_RELATION("User", args.value) })
  userId: string;

  @ApiPropertyOptional({ example: "uuid-of-homework" })
  @IsOptional()
  @IsUUID("4", { message: messages.INVALID_ID("Homework ID") })
  @Exists("homework", { message: args => messages.INVALID_RELATION("Homework", args.value) })
  homeworkId?: string;

  @ApiPropertyOptional({ example: "uuid-of-test" })
  @IsOptional()
  @IsUUID("4", { message: messages.INVALID_ID("Test ID") })
  @Exists("test", { message: args => messages.INVALID_RELATION("Test", args.value) })
  testId?: string;

  @ApiProperty({ example: "Answer content or JSON result" })
  @IsNotEmpty({ message: messages.REQUIRED_FIELD("Content") })
  @IsString({ message: messages.MUST_BE_STRING("Content") })
  content: string;

  @ApiPropertyOptional({ example: 85.5 })
  @IsOptional()
  @IsNumber({}, { message: messages.MUST_BE_NUMBER("Score") })
  score?: number;
}
