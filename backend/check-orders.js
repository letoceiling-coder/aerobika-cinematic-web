const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  try {
    const count = await prisma.order.count();
    console.log('Total orders in DB:', count);
    
    const orders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: true }
    });
    
    console.log('\nRecent orders:');
    orders.forEach(o => {
      console.log(`  ID: ${o.id}, User: ${o.userId} (${o.user?.firstName || 'N/A'}), Total: ${o.totalPrice}₽, Status: ${o.status}, Created: ${o.createdAt}`);
    });
    
    const users = await prisma.user.findMany({ take: 5 });
    console.log('\nRecent users:');
    users.forEach(u => {
      console.log(`  ID: ${u.id}, TelegramID: ${u.telegramId}, Name: ${u.firstName || 'N/A'}`);
    });
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await prisma.$disconnect();
  }
})();
