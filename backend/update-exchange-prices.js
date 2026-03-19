const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const product = await prisma.product.update({
    where: { id: 1 },
    data: {
      exchangePrice5l: 2500,
      exchangePrice10l: 4000,
    },
  });
  
  console.log('Updated product:', {
    id: product.id,
    price5l: product.price5l,
    price10l: product.price10l,
    exchangePrice5l: product.exchangePrice5l,
    exchangePrice10l: product.exchangePrice10l,
  });
  
  await prisma.$disconnect();
}

main().catch(console.error);
