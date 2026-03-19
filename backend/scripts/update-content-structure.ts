import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Updating content blocks structure...');

  const updates = [
    // Hero block (home page)
    { key: 'hero_title', page: 'home', block: 'hero', label: 'Заголовок' },
    { key: 'hero_description', page: 'home', block: 'hero', label: 'Описание' },
    { key: 'hero_delivery_text', page: 'home', block: 'hero', label: 'Текст доставки' },
    
    // Footer block (global)
    { key: 'footer_phone', page: 'global', block: 'footer', label: 'Телефон' },
    { key: 'footer_telegram', page: 'global', block: 'footer', label: 'Telegram' },
    
    // Delivery block (home page)
    { key: 'delivery_text', page: 'home', block: 'delivery', label: 'Текст доставки' },
    
    // Products block (home page)
    { key: 'products_title', page: 'home', block: 'products', label: 'Заголовок раздела' },
    { key: 'product_5l_title', page: 'home', block: 'products', label: 'Название 5л' },
    { key: 'product_10l_title', page: 'home', block: 'products', label: 'Название 10л' },
  ];

  for (const update of updates) {
    const existing = await prisma.contentBlock.findUnique({
      where: { key: update.key },
    });

    if (existing) {
      await prisma.contentBlock.update({
        where: { key: update.key },
        data: {
          page: update.page,
          block: update.block,
          label: update.label,
        },
      });
      console.log(`✅ Updated: ${update.key} → page: ${update.page}, block: ${update.block}, label: ${update.label}`);
    } else {
      console.log(`⚠️  Not found: ${update.key}`);
    }
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
