const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Updating image URLs...');
  
  const result = await prisma.product.updateMany({
    where: { imageUrl: '/src/assets/cylinder-5l.png' },
    data: { imageUrl: '/assets/cylinder-5l.png' }
  });
  
  console.log(`Updated ${result.count} products`);
  
  const product = await prisma.product.findFirst();
  console.log('Product:', JSON.stringify({
    id: product.id,
    name: product.name,
    imageUrl: product.imageUrl
  }));
  
  await prisma.$disconnect();
}

main().catch(console.error);
