import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Adding columns to content_blocks...');

  try {
    await prisma.$executeRaw`ALTER TABLE content_blocks ADD COLUMN page TEXT`;
    console.log('✅ Added column: page');
  } catch (e: any) {
    if (e.message?.includes('duplicate column')) {
      console.log('ℹ️  Column page already exists');
    } else {
      console.error('Error adding page:', e.message);
    }
  }

  try {
    await prisma.$executeRaw`ALTER TABLE content_blocks ADD COLUMN block TEXT`;
    console.log('✅ Added column: block');
  } catch (e: any) {
    if (e.message?.includes('duplicate column')) {
      console.log('ℹ️  Column block already exists');
    } else {
      console.error('Error adding block:', e.message);
    }
  }

  try {
    await prisma.$executeRaw`ALTER TABLE content_blocks ADD COLUMN label TEXT`;
    console.log('✅ Added column: label');
  } catch (e: any) {
    if (e.message?.includes('duplicate column')) {
      console.log('ℹ️  Column label already exists');
    } else {
      console.error('Error adding label:', e.message);
    }
  }

  console.log('✨ Columns added!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
