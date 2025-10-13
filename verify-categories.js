const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function verifyCategoriesAndProducts() {
  try {
    console.log('=== Verifying Categories ===');
    const categories = await prisma.category.findMany();
    categories.forEach(category => {
      console.log(`- ${category.id}: ${category.name_en}`);
    });
    
    console.log('\n=== Verifying Products by Category ===');
    for (const category of categories) {
      const productCount = await prisma.product.count({
        where: {
          category_id: category.id
        }
      });
      console.log(`${category.name_en}: ${productCount} products`);
    }
    
    console.log('\n=== Sample Products ===');
    const products = await prisma.product.findMany({
      take: 10,
      include: {
        category: true
      }
    });
    
    products.forEach(product => {
      console.log(`- ${product.title_en} (${product.category.name_en})`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

verifyCategoriesAndProducts();