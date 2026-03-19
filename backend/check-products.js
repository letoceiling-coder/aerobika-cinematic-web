const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany();
  console.log('Total products in DB:', products.length);
  products.forEach(p => {
    console.log(`ID: ${p.id}, Name: ${p.name}, price5l: ${p.price5l}, price10l: ${p.price10l}, isActive: ${p.isActive}`);
  });
  
  const activeProducts = products.filter(p => p.isActive);
  console.log('\nActive products:', activeProducts.length);
  activeProducts.forEach(p => {
    console.log(`ID: ${p.id}, price5l: ${p.price5l}`);
  });
  
  await prisma.$disconnect();
}

main().catch(console.error);
