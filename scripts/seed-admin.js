const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function main() {
  const prisma = new PrismaClient();

  const username = 'admin';
  const passwordHash = bcrypt.hashSync('admin123', 10);

  const existing = await prisma.user.findUnique({ where: { username } });

  if (existing) {
    await prisma.user.update({
      where: { id: existing.id },
      data: {
        name: 'Admin',
        username,
        email: existing.email || 'admin@local.test',
        password: passwordHash,
        role: 'admin',
      },
    });
  } else {
    await prisma.user.create({
      data: {
        name: 'Admin',
        username,
        email: 'admin@local.test',
        password: passwordHash,
        role: 'admin',
      },
    });
  }

  const user = await prisma.user.findUnique({ where: { username } });
  console.log(JSON.stringify({ ok: true, username: user.username, role: user.role, email: user.email }));

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
