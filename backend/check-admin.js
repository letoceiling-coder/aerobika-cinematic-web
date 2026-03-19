const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

prisma.adminUser.findMany()
  .then(users => {
    if (users.length === 0) {
      console.log('❌ No admin users found');
    } else {
      console.log('✅ Admin users found:');
      users.forEach(u => {
        console.log('  Email:', u.email);
        console.log('  Name:', u.name);
        console.log('  Role:', u.role);
        console.log('  Created:', u.createdAt);
        console.log('---');
      });
    }
    prisma.$disconnect();
  })
  .catch(e => {
    console.error('Error:', e.message);
    prisma.$disconnect();
  });
