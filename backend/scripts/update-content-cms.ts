import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Updating Content CMS to match site structure...');

  // Delete product_5l_title and product_10l_title (managed via /admin/products)
  const keysToDelete = ['product_5l_title', 'product_10l_title'];
  for (const key of keysToDelete) {
    const existing = await prisma.contentBlock.findUnique({
      where: { key },
    });
    if (existing) {
      await prisma.contentBlock.delete({
        where: { key },
      });
      console.log(`🗑️  Deleted: ${key}`);
    }
  }

  // Update or create Hero fields
  const heroFields = [
    { key: 'hero_subtitle', value: 'N₂O', type: 'text', page: 'home', block: 'hero', label: 'Подзаголовок' },
    { key: 'hero_button_primary', value: 'Заказать', type: 'text', page: 'home', block: 'hero', label: 'Кнопка (основная)' },
    { key: 'hero_button_secondary', value: 'Каталог', type: 'text', page: 'home', block: 'hero', label: 'Кнопка (вторичная)' },
    { key: 'hero_stats_1_title', value: '30 мин', type: 'text', page: 'home', block: 'hero', label: 'Статистика 1 - значение' },
    { key: 'hero_stats_1_desc', value: 'Доставка', type: 'text', page: 'home', block: 'hero', label: 'Статистика 1 - описание' },
    { key: 'hero_stats_2_title', value: '24/7', type: 'text', page: 'home', block: 'hero', label: 'Статистика 2 - значение' },
    { key: 'hero_stats_2_desc', value: 'Работаем', type: 'text', page: 'home', block: 'hero', label: 'Статистика 2 - описание' },
    { key: 'hero_stats_3_title', value: '100%', type: 'text', page: 'home', block: 'hero', label: 'Статистика 3 - значение' },
    { key: 'hero_stats_3_desc', value: 'Качество', type: 'text', page: 'home', block: 'hero', label: 'Статистика 3 - описание' },
    { key: 'hero_image', value: '', type: 'image', page: 'home', block: 'hero', label: 'Изображение' },
  ];

  for (const field of heroFields) {
    const existing = await prisma.contentBlock.findUnique({
      where: { key: field.key },
    });
    if (existing) {
      await prisma.contentBlock.update({
        where: { key: field.key },
        data: field,
      });
      console.log(`✅ Updated: ${field.key}`);
    } else {
      await prisma.contentBlock.create({
        data: field,
      });
      console.log(`✅ Created: ${field.key}`);
    }
  }

  // Create How It Works block
  const howFields = [
    { key: 'how_title', value: 'Как это работает', type: 'text', page: 'home', block: 'how', label: 'Заголовок' },
    { key: 'how_step_1_title', value: 'Выберите товар', type: 'text', page: 'home', block: 'how', label: 'Шаг 1 - заголовок' },
    { key: 'how_step_1_desc', value: 'Выберите объём и тип покупки', type: 'textarea', page: 'home', block: 'how', label: 'Шаг 1 - описание' },
    { key: 'how_step_2_title', value: 'Оформите заказ', type: 'text', page: 'home', block: 'how', label: 'Шаг 2 - заголовок' },
    { key: 'how_step_2_desc', value: 'Укажите адрес и контакты', type: 'textarea', page: 'home', block: 'how', label: 'Шаг 2 - описание' },
    { key: 'how_step_3_title', value: 'Получите доставку', type: 'text', page: 'home', block: 'how', label: 'Шаг 3 - заголовок' },
    { key: 'how_step_3_desc', value: 'Быстрая доставка по городу', type: 'textarea', page: 'home', block: 'how', label: 'Шаг 3 - описание' },
  ];

  for (const field of howFields) {
    const existing = await prisma.contentBlock.findUnique({
      where: { key: field.key },
    });
    if (existing) {
      await prisma.contentBlock.update({
        where: { key: field.key },
        data: field,
      });
      console.log(`✅ Updated: ${field.key}`);
    } else {
      await prisma.contentBlock.create({
        data: field,
      });
      console.log(`✅ Created: ${field.key}`);
    }
  }

  // Update Footer fields
  const footerFields = [
    { key: 'footer_logo_text', value: 'N₂O ROSTOV', type: 'text', page: 'global', block: 'footer', label: 'Текст логотипа' },
    { key: 'footer_city', value: 'Ростов-на-Дону', type: 'text', page: 'global', block: 'footer', label: 'Город' },
    { key: 'footer_warning', value: '⚠️ 18+ Продажа лицам младше 18 лет запрещена', type: 'text', page: 'global', block: 'footer', label: 'Предупреждение' },
    { key: 'footer_legal', value: 'Использовать строго в рамках законодательства РФ', type: 'textarea', page: 'global', block: 'footer', label: 'Правовая информация' },
    { key: 'footer_copyright', value: '© 2026 Все права защищены', type: 'text', page: 'global', block: 'footer', label: 'Копирайт' },
    { key: 'footer_dev', value: 'Разработка neeklo.studio', type: 'text', page: 'global', block: 'footer', label: 'Разработка' },
  ];

  for (const field of footerFields) {
    const existing = await prisma.contentBlock.findUnique({
      where: { key: field.key },
    });
    if (existing) {
      await prisma.contentBlock.update({
        where: { key: field.key },
        data: field,
      });
      console.log(`✅ Updated: ${field.key}`);
    } else {
      await prisma.contentBlock.create({
        data: field,
      });
      console.log(`✅ Created: ${field.key}`);
    }
  }

  console.log('✨ Content CMS update completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
