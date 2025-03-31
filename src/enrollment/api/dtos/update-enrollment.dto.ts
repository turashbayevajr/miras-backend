import { IsOptional, IsUUID } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";
import messages from "../../../configs/messages";
import { Exists } from "../../../validators/exists.validator";

export class UpdateEnrollmentDto {
  @ApiPropertyOptional({ example: "uuid" })
  @IsOptional()
  @IsUUID("4", { message: messages.INVALID_ID("User ID") })
  @Exists("user", { message: args => messages.INVALID_RELATION("User", args.value) })
  userId?: string;

  @ApiPropertyOptional({ example: "uuid" })
  @IsOptional()
  @IsUUID("4", { message: messages.INVALID_ID("Course ID") })
  @Exists("course", { message: args => messages.INVALID_RELATION("Course", args.value) })
  courseId?: string;
}
