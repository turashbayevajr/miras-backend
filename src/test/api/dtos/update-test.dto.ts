import { IsOptional, IsString, IsArray } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";
import messages from "../../../configs/messages";

export class UpdateTestDto {
  @ApiPropertyOptional({ example: "Updated Test Title" })
  @IsOptional()
  @IsString({ message: messages.MUST_BE_STRING("Title") })
  title?: string;

  @ApiPropertyOptional({ example: [{ question: "Updated Q?", type: "short" }], type: Array })
  @IsOptional()
  @IsArray({ message: messages.MUST_BE_ARRAY("Questions") })
  questions?: any[];
}
