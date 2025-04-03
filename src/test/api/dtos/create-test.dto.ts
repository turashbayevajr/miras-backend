import { IsNotEmpty, IsString, IsUUID, IsArray, ValidateNested, ArrayMinSize } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import messages from "../../../configs/messages";
import { Type } from "class-transformer";
import { Exists } from "../../../validators/exists.validator";
export class CreateQuestionDto {
  @ApiProperty({ example: "What is NestJS?" })
  @IsNotEmpty({ message: messages.REQUIRED_FIELD("Question") })
  @IsString({ message: messages.MUST_BE_STRING("Question") })
  text: string;

  @ApiProperty({ example: [{ text: "Answer A", isCorrect: true }] })
  @IsArray({ message: messages.MUST_BE_ARRAY("Variants") })
  @ArrayMinSize(1, { message: messages.REQUIRED_FIELD("Variants") })
  variants: { text: string; isCorrect: boolean }[];
}
// Create DTO for the entire test
export class CreateTestDto {
  @ApiProperty({ example: "Test 1: Basics" })
  @IsNotEmpty({ message: messages.REQUIRED_FIELD("Title") })
  @IsString({ message: messages.MUST_BE_STRING("Title") })
  title: string;

  @ApiProperty({ type: [CreateQuestionDto], description: "List of questions with variants" })
  @IsNotEmpty({ message: messages.REQUIRED_FIELD("Questions") })
  @IsArray({ message: messages.MUST_BE_ARRAY("Questions") })
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDto)
  questions: CreateQuestionDto[];

  @ApiProperty({ example: "uuid-of-lesson", description: "Lesson ID" })
  @IsUUID("4", { message: messages.INVALID_ID("Lesson ID") })
  @Exists("lesson", { message: args => messages.INVALID_RELATION("Lesson", args.value) })
  lessonId: string;
}
