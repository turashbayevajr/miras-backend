import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    let retries = 5;
    while (retries) {
      try {
        await this.$connect(); // ✅ ← исправлено
        console.log('✅ Connected to DB');
        break;
      } catch (err) {
        console.log('⏳ DB not ready, retrying...', err.message);
        retries -= 1;
        await new Promise((res) => setTimeout(res, 5000));
      }
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
