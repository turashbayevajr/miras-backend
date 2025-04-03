import { IsOptional, IsString, IsUUID, IsArray, ValidateNested, ArrayMinSize } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import messages from "../../../configs/messages";
import { Type } from "class-transformer";
import { Exists } from "../../../validators/exists.validator";

export class UpdateQuestionDto {
  @ApiProperty({ example: "question-id" })
  @IsString({ message: messages.MUST_BE_STRING("ID") })
  id: string;

  @ApiProperty({ example: "What is NestJS?" })
  @IsOptional()
  @IsString({ message: messages.MUST_BE_STRING("Question") })
  text?: string;

  @ApiProperty({ example: [{ text: "Answer A", isCorrect: true }] })
  @IsOptional()
  @IsArray({ message: messages.MUST_BE_ARRAY("Variants") })
  @ArrayMinSize(1, { message: messages.REQUIRED_FIELD("Variants") })
  variants?: { id: string; text: string; isCorrect: boolean }[];
}
// Update DTO for the entire test
export class UpdateTestDto {
  @ApiProperty({ example: "Test 1: Basics" })
  @IsOptional()
  @IsString({ message: messages.MUST_BE_STRING("Title") })
  title?: string;

  @ApiProperty({ type: [UpdateQuestionDto], description: "List of questions with variants" })
  @IsOptional()
  @IsArray({ message: messages.MUST_BE_ARRAY("Questions") })
  @ValidateNested({ each: true })
  @Type(() => UpdateQuestionDto)
  questions?: UpdateQuestionDto[];

  @ApiProperty({ example: "uuid-of-lesson", description: "Lesson ID" })
  @IsOptional()
  @IsUUID("4", { message: messages.INVALID_ID("Lesson ID") })
  @Exists("lesson", { message: args => messages.INVALID_RELATION("Lesson", args.value) })
  lessonId?: string;
}
