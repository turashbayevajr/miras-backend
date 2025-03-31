import { IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import messages from "../../../configs/messages";
import { Exists } from "../../../validators/exists.validator";

export class CreateEnrollmentDto {
  @ApiProperty({ example: "f2e2b6b1-1234-4d88-b441-123456789abc" })
  @IsUUID("4", { message: messages.INVALID_ID("User ID") })
  @Exists("user", { message: args => messages.INVALID_RELATION("User", args.value) })
  userId: string;

  @ApiProperty({ example: "d7aa9f14-4321-44e9-b11b-abcdefabcdef" })
  @IsUUID("4", { message: messages.INVALID_ID("Course ID") })
  @Exists("course", { message: args => messages.INVALID_RELATION("Course", args.value) })
  courseId: string;
}
