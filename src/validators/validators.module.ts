import { Module } from "@nestjs/common";
import { ExistsValidator } from "./exists.validator";
import { PrismaModule } from "../prisma/prisma.module";
import { UniqueValidator } from "./unique.validator";

@Module({
  imports: [PrismaModule],
  providers: [ExistsValidator, UniqueValidator],
  exports: [ExistsValidator, UniqueValidator],
})
export class ValidatorsModule {}
