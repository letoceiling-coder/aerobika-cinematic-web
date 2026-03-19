const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Updating image URLs from /assets/ to /uploads/...');
  
  // Get all products with /assets/ path
  const products = await prisma.product.findMany({
    where: {
      imageUrl: {
        startsWith: '/assets/'
      }
    }
  });
  
  console.log(`Found ${products.length} products to update`);
  
  // Update each product
  for (const product of products) {
    const newUrl = product.imageUrl.replace('/assets/', '/uploads/');
    await prisma.product.update({
      where: { id: product.id },
      data: { imageUrl: newUrl }
    });
    console.log(`Updated product ${product.id}: ${product.imageUrl} -> ${newUrl}`);
  }
  
  // Also update specific old path
  const result2 = await prisma.product.updateMany({
    where: { imageUrl: '/assets/cylinder-5l.png' },
    data: { imageUrl: '/uploads/cylinder-5l.png' }
  });
  
  console.log(`Updated ${result2.count} products with specific path`);
  
  const product = await prisma.product.findFirst();
  console.log('Sample product:', JSON.stringify({
    id: product.id,
    name: product.name,
    imageUrl: product.imageUrl
  }));
  
  await prisma.$disconnect();
}

main().catch(console.error);
