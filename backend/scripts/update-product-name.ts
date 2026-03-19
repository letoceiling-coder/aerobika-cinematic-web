import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Updating product name: "Пищевая закись азота" → "Закись азота"');

  const products = await prisma.product.findMany({
    where: {
      name: {
        contains: 'Пищевая',
      },
    },
  });

  for (const product of products) {
    const newName = product.name.replace('Пищевая закись азота', 'Закись азота').replace('Пищевая ', '');
    await prisma.product.update({
      where: { id: product.id },
      data: { name: newName },
    });
    console.log(`✅ Updated product ${product.id}: "${product.name}" → "${newName}"`);
  }

  if (products.length === 0) {
    console.log('ℹ️  No products with "Пищевая" found');
  }

  console.log('✨ Update completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
