const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testPrisma() {
  try {
    console.log('Testing Prisma client...');
    
    // Test if we can access the carts model
    const cartCount = await prisma.carts.count();
    console.log(`Current cart count: ${cartCount}`);
    
    console.log('Prisma client is working correctly!');
  } catch (error) {
    console.error('Prisma client error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testPrisma();