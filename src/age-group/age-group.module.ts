import { Module } from '@nestjs/common';
import { AgeGroupController } from './api/age-group.controller';
import { AgeGroupService } from './service/age-group.service';
import { AgeGroupRepository } from './repository/age-group.repository';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [AgeGroupController],
  providers: [AgeGroupService, AgeGroupRepository, PrismaService],
  exports:  [AgeGroupService, AgeGroupRepository],
})
export class AgeGroupModule {}
