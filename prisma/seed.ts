const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME;

  if (!email || !password || !name) {
    throw new Error(
      'Missing required env vars: ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME'
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      hashedPassword,
      role: 'admin',
    },
    create: {
      name,
      email,
      hashedPassword,
      role: 'admin',
    },
  });

  console.log(`✅ Admin account ready: ${admin.email} (id: ${admin.id})`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
