import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const phone = '+77777777777';

  // check if user already exists
  const existing = await prisma.user.findUnique({ where: { phone } });
  if (existing) {
    console.log(`✅ Admin already exists: ${phone}`);
    return;
  }

  const hashedPassword = await bcrypt.hash('batmenloh', 10);

  const user =await prisma.user.upsert({
  where: { phone },
  update: {}, // ничего не меняем, если уже есть
  create: {
    fullName: 'Admin User',
    phone,
    password: hashedPassword,
    role: Role.ADMIN,
  },
});


  console.log('✅ Admin user created:', user.phone);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
