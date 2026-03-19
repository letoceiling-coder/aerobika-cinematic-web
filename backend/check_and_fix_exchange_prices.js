const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fix() {
  try {
    // Try to update to see if columns exist
    try {
      await prisma.product.update({
        where: { id: 1 },
        data: { exchangePrice5l: 2505, exchangePrice10l: 4005 }
      });
      console.log('✅ Update successful! Columns exist.');
      
      const product = await prisma.product.findUnique({ where: { id: 1 } });
      console.log('Updated product:', JSON.stringify({
        id: product.id,
        exchangePrice5l: product.exchangePrice5l,
        exchangePrice10l: product.exchangePrice10l
      }, null, 2));
    } catch (e) {
      if (e.message.includes('Unknown arg') || e.message.includes('Unknown field')) {
        console.log('❌ Columns missing in database!');
        console.log('Error:', e.message);
        console.log('Attempting to add columns...');
        
        // Try to add columns using raw SQL
        try {
          await prisma.$executeRaw`ALTER TABLE products ADD COLUMN exchange_price_5l INTEGER`;
          await prisma.$executeRaw`ALTER TABLE products ADD COLUMN exchange_price_10l INTEGER`;
          console.log('✅ Columns added!');
          
          // Regenerate Prisma client
          console.log('Regenerating Prisma client...');
          const { execSync } = require('child_process');
          execSync('npx prisma generate', { stdio: 'inherit' });
          
          // Try update again
          await prisma.product.update({
            where: { id: 1 },
            data: { exchangePrice5l: 2505, exchangePrice10l: 4005 }
          });
          console.log('✅ Update successful after adding columns!');
        } catch (addError) {
          console.error('❌ Failed to add columns:', addError.message);
        }
      } else {
        throw e;
      }
    }
  } catch (e) {
    console.error('❌ Error:', e.message);
    console.error('Stack:', e.stack);
  } finally {
    await prisma.$disconnect();
  }
}

fix();
