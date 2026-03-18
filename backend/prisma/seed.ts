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
        name: 'Пищевая закись азота',
        description: 'Высококачественный продукт для профессионального использования',
        price5l: 3500,
        price10l: 5500,
        exchangePrice5l: 2800,  // Exchange price (lower than buy)
        exchangePrice10l: 4400, // Exchange price (lower than buy)
        imageUrl: '/src/assets/cylinder-5l.png',
        isActive: true,
      },
    });
    console.log('✅ Default product created');
  } else {
    console.log('ℹ️  Products already exist');
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
