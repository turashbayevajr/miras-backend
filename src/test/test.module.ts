import { Module } from '@nestjs/common';
import { TestController } from './api/test.controller';
import { TestService } from './service/test.service';
import { TestRepository } from './repository/test.repository';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [TestController],
  providers: [TestService, TestRepository, PrismaService],
  exports: [TestService, TestRepository],
})
export class TestModule {}
