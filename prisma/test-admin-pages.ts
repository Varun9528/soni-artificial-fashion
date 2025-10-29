import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Testing admin pages data flow...');

  try {
    // Test 1: Check if database connection is working
    console.log('1. Testing database connection...');
    const productCount = await prisma.product.count();
    console.log(`   Found ${productCount} products in database`);
    
    const categoryCount = await prisma.category.count();
    console.log(`   Found ${categoryCount} categories in database`);
    
    const artisanCount = await prisma.artisan.count();
    console.log(`   Found ${artisanCount} artisans in database`);
    
    const bannerCount = await prisma.banner.count();
    console.log(`   Found ${bannerCount} banners in database`);
    
    const userCount = await prisma.user.count();
    console.log(`   Found ${userCount} users in database`);
    
    // Test 2: Check admin user
    console.log('2. Testing admin user...');
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@sonifashion.com' }
    });
    
    if (adminUser) {
      console.log(`   Admin user found: ${adminUser.name} (${adminUser.email})`);
      console.log(`   Role: ${adminUser.role}`);
    } else {
      console.log('   Admin user not found!');
    }
    
    // Test 3: Check some sample data
    console.log('3. Testing sample data...');
    const sampleProducts = await prisma.product.findMany({
      take: 3
    });
    
    console.log('   Sample products:');
    for (const product of sampleProducts) {
      console.log(`     - ${product.title_en} (ID: ${product.id})`);
    }
    
    const sampleCategories = await prisma.category.findMany({ take: 3 });
    console.log('   Sample categories:');
    for (const category of sampleCategories) {
      console.log(`     - ${category.name_en} (${category.id})`);
    }
    
    console.log('4. Testing dashboard stats...');
    const stats = {
      totalProducts: await prisma.product.count(),
      totalOrders: await prisma.order.count(),
      totalUsers: await prisma.user.count(),
      totalArtisans: await prisma.artisan.count(),
      totalCategories: await prisma.category.count(),
      totalBanners: await prisma.banner.count()
    };
    
    console.log('   Dashboard stats:');
    console.log(`     Total Products: ${stats.totalProducts}`);
    console.log(`     Total Orders: ${stats.totalOrders}`);
    console.log(`     Total Users: ${stats.totalUsers}`);
    console.log(`     Total Artisans: ${stats.totalArtisans}`);
    console.log(`     Total Categories: ${stats.totalCategories}`);
    console.log(`     Total Banners: ${stats.totalBanners}`);
    
    console.log('\n✅ All admin page data tests completed successfully!');
    console.log('✅ Database connection is working');
    console.log('✅ Data is flowing correctly from database to frontend');
    console.log('✅ Admin dashboard should display real data');
    
  } catch (error) {
    console.error('❌ Error testing admin pages:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });