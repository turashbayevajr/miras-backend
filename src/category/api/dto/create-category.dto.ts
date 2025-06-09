import { IsString, IsNotEmpty, IsOptional, MaxLength, IsUUID } from 'class-validator';
import messages from 'src/configs/messages';
import { Unique } from 'src/validators/unique.validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @Unique("category", "name", { message: messages.ALREADY_USED("Name") })
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @Unique("category", "slug", { message: messages.ALREADY_USED("Slug") })
  slug: string;
}
