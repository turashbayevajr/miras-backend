import { IsNotEmpty, IsString, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import messages from "../../../configs/messages";
import { Exists } from "../../../validators/exists.validator";

export class CreateHomeworkDto {
  @ApiProperty({ example: "Homework 1: Intro Questions" })
  @IsNotEmpty({ message: messages.REQUIRED_FIELD("Title") })
  @IsString({ message: messages.MUST_BE_STRING("Title") })
  title: string;

  @ApiProperty({ example: "Please answer the following..." })
  @IsNotEmpty({ message: messages.REQUIRED_FIELD("Content") })
  @IsString({ message: messages.MUST_BE_STRING("Content") })
  content: string;

  @ApiProperty({ example: "uuid-of-lesson" })
  @IsUUID("4", { message: messages.INVALID_ID("Lesson ID") })
  @Exists("lesson", { message: args => messages.INVALID_RELATION("Lesson", args.value) })
  lessonId: string;
}
