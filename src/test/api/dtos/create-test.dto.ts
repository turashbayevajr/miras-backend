import { IsNotEmpty, IsString, IsUUID, IsArray } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import messages from "../../../configs/messages";
import { Exists } from "../../../validators/exists.validator";

export class CreateTestDto {
  @ApiProperty({ example: "Test 1: Basics" })
  @IsNotEmpty({ message: messages.REQUIRED_FIELD("Title") })
  @IsString({ message: messages.MUST_BE_STRING("Title") })
  title: string;

  @ApiProperty({ example: [{ question: "What is NestJS?", type: "short" }], type: Array })
  @IsNotEmpty({ message: messages.REQUIRED_FIELD("Questions") })
  @IsArray({ message: messages.MUST_BE_ARRAY("Questions") })
  questions: any[];

  @ApiProperty({ example: "uuid-of-lesson", description: "Lesson ID" })
  @IsUUID("4", { message: messages.INVALID_ID("Lesson ID") })
  @Exists("lesson", { message: args => messages.INVALID_RELATION("Lesson", args.value) })
  lessonId: string;
}
