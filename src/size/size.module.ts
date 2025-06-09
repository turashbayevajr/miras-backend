import { Module } from '@nestjs/common';
import { SizeController } from './api/size.controller';
import { SizeService } from './service/size.service';
import { SizeRepository } from './repository/size.repository';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [SizeController],
  providers: [SizeService, SizeRepository, PrismaService],
  exports: [SizeService, SizeRepository]
})
export class SizeModule {}
