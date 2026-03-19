import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create default admin user
  const adminEmail = 'dsc-23@yandex.ru';
  const adminPassword = '123123123';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const existingAdmin = await prisma.adminUser.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    await prisma.adminUser.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: 'Джон Уик',
        role: 'admin',
      },
    });
    console.log('✅ Default admin user created');
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
  } else {
    console.log('ℹ️  Admin user already exists');
  }

  // Create default products
  const existingProducts = await prisma.product.count();
  if (existingProducts === 0) {
    await prisma.product.create({
      data: {
        name: 'Закись азота',
        description: 'Высококачественный продукт для профессионального использования',
        price5l: 3500,
        price10l: 5500,
        exchangePrice5l: 2800,  // Exchange price (lower than buy)
        exchangePrice10l: 4400, // Exchange price (lower than buy)
        imageUrl: '/uploads/cylinder-5l.png',
        isActive: true,
      },
    });
    console.log('✅ Default product created');
  } else {
    console.log('ℹ️  Products already exist');
  }

  // Create default content blocks
  const contentBlocks = [
    // Hero block (home page) - FULL
    { key: 'hero_title', value: 'Закись азота', type: 'text', page: 'home', block: 'hero', label: 'Заголовок' },
    { key: 'hero_subtitle', value: 'N₂O', type: 'text', page: 'home', block: 'hero', label: 'Подзаголовок' },
    { key: 'hero_description', value: 'Премиальное качество. Сертифицированный продукт. Быстрая и надёжная доставка по городу.', type: 'textarea', page: 'home', block: 'hero', label: 'Описание' },
    { key: 'hero_delivery_text', value: 'Доставка за 30–60 минут', type: 'text', page: 'home', block: 'hero', label: 'Текст доставки' },
    { key: 'hero_button_primary', value: 'Заказать', type: 'text', page: 'home', block: 'hero', label: 'Кнопка (основная)' },
    { key: 'hero_button_secondary', value: 'Каталог', type: 'text', page: 'home', block: 'hero', label: 'Кнопка (вторичная)' },
    { key: 'hero_stats_1_title', value: '30 мин', type: 'text', page: 'home', block: 'hero', label: 'Статистика 1 - значение' },
    { key: 'hero_stats_1_desc', value: 'Доставка', type: 'text', page: 'home', block: 'hero', label: 'Статистика 1 - описание' },
    { key: 'hero_stats_2_title', value: '24/7', type: 'text', page: 'home', block: 'hero', label: 'Статистика 2 - значение' },
    { key: 'hero_stats_2_desc', value: 'Работаем', type: 'text', page: 'home', block: 'hero', label: 'Статистика 2 - описание' },
    { key: 'hero_stats_3_title', value: '100%', type: 'text', page: 'home', block: 'hero', label: 'Статистика 3 - значение' },
    { key: 'hero_stats_3_desc', value: 'Качество', type: 'text', page: 'home', block: 'hero', label: 'Статистика 3 - описание' },
    { key: 'hero_image', value: '', type: 'image', page: 'home', block: 'hero', label: 'Изображение' },
    
    // How It Works block (home page)
    { key: 'how_title', value: 'Как это работает', type: 'text', page: 'home', block: 'how', label: 'Заголовок' },
    { key: 'how_step_1_title', value: 'Выберите товар', type: 'text', page: 'home', block: 'how', label: 'Шаг 1 - заголовок' },
    { key: 'how_step_1_desc', value: 'Выберите объём и тип покупки', type: 'textarea', page: 'home', block: 'how', label: 'Шаг 1 - описание' },
    { key: 'how_step_2_title', value: 'Оформите заказ', type: 'text', page: 'home', block: 'how', label: 'Шаг 2 - заголовок' },
    { key: 'how_step_2_desc', value: 'Укажите адрес и контакты', type: 'textarea', page: 'home', block: 'how', label: 'Шаг 2 - описание' },
    { key: 'how_step_3_title', value: 'Получите доставку', type: 'text', page: 'home', block: 'how', label: 'Шаг 3 - заголовок' },
    { key: 'how_step_3_desc', value: 'Быстрая доставка по городу', type: 'textarea', page: 'home', block: 'how', label: 'Шаг 3 - описание' },
    
    // Products block (home page) - только заголовок, без product_5l_title и product_10l_title
    { key: 'products_title', value: 'Наши продукты', type: 'text', page: 'home', block: 'products', label: 'Заголовок раздела' },
    
    // Footer block (global) - FULL
    { key: 'footer_phone', value: '', type: 'text', page: 'global', block: 'footer', label: 'Телефон' },
    { key: 'footer_telegram', value: '', type: 'text', page: 'global', block: 'footer', label: 'Telegram' },
    { key: 'footer_logo_text', value: 'N₂O ROSTOV', type: 'text', page: 'global', block: 'footer', label: 'Текст логотипа' },
    { key: 'footer_city', value: 'Ростов-на-Дону', type: 'text', page: 'global', block: 'footer', label: 'Город' },
    { key: 'footer_warning', value: '⚠️ 18+ Продажа лицам младше 18 лет запрещена', type: 'text', page: 'global', block: 'footer', label: 'Предупреждение' },
    { key: 'footer_legal', value: 'Использовать строго в рамках законодательства РФ', type: 'textarea', page: 'global', block: 'footer', label: 'Правовая информация' },
    { key: 'footer_copyright', value: '© 2026 Все права защищены', type: 'text', page: 'global', block: 'footer', label: 'Копирайт' },
    { key: 'footer_dev', value: 'Разработка neeklo.studio', type: 'text', page: 'global', block: 'footer', label: 'Разработка' },
  ];

  for (const block of contentBlocks) {
    const existing = await prisma.contentBlock.findUnique({
      where: { key: block.key },
    });

    if (!existing) {
      await prisma.contentBlock.create({
        data: block,
      });
      console.log(`✅ Content block created: ${block.key}`);
    } else {
      // Update existing block with new fields if they are missing
      if (!existing.page || !existing.block || !existing.label) {
        await prisma.contentBlock.update({
          where: { key: block.key },
          data: {
            page: block.page || existing.page,
            block: block.block || existing.block,
            label: block.label || existing.label,
          },
        });
        console.log(`✅ Content block updated: ${block.key}`);
      } else {
        console.log(`ℹ️  Content block already exists: ${block.key}`);
      }
    }
  }

  console.log('✨ Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
