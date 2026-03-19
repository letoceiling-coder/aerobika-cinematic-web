const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

prisma.adminUser.findUnique({
  where: { email: 'dsc-23@yandex.ru' },
  select: {
    id: true,
    email: true,
    password: true,
    name: true,
    role: true,
    createdAt: true
  }
})
  .then(user => {
    if (!user) {
      console.log('вќЊ User not found');
    } else {
      console.log('вњ… User found:');
      console.log('  ID:', user.id);
      console.log('  Email:', user.email);
      console.log('  Password hash:', user.password.substring(0, 20) + '...');
      console.log('  Hash length:', user.password.length);
      console.log('  Name:', user.name);
      console.log('  Role:', user.role);
      console.log('  Created:', user.createdAt);
    }
    prisma.\();
  })
  .catch(e => {
    console.error('Error:', e.message);
    prisma.\();
  });
