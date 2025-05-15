import { PrismaClient, Role, Plan } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@gmail.com';

  // check if user already exists
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`✅ Admin already exists: ${email}`);
    return;
  }

  const hashedPassword = await bcrypt.hash('3EnTeR#@23price', 10);

  const user = await prisma.user.create({
    data: {
      fullName: 'Admin User',
      email,
      password: hashedPassword,
      role: Role.ADMIN,
      plan: Plan.ENTERPRISE,
    },
  });

  console.log('✅ Admin user created:', user.email);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
