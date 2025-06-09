import { Module } from '@nestjs/common';
import { ColorController } from './api/color.controller';
import { ColorService } from './service/color.service';
import { ColorRepository } from './repository/color.repository';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ColorController],
  providers: [ColorService, ColorRepository, PrismaService],
  exports: [ColorService, ColorRepository]
})
export class ColorModule {}
