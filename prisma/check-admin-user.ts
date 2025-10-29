import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Checking admin user...');
  
  try {
    // Check if the correct admin user exists
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@soniartificialfashion.com' }
    });
    
    if (adminUser) {
      console.log('✅ Admin user found:');
      console.log(`   ID: ${adminUser.id}`);
      console.log(`   Email: ${adminUser.email}`);
      console.log(`   Name: ${adminUser.name}`);
      console.log(`   Role: ${adminUser.role}`);
    } else {
      console.log('❌ Admin user with email admin@soniartificialfashion.com not found');
    }
    
    // Check if the old admin user still exists
    const oldAdminUser = await prisma.user.findUnique({
      where: { email: 'admin@lettex.com' }
    });
    
    if (oldAdminUser) {
      console.log('⚠️  Old admin user still exists:');
      console.log(`   ID: ${oldAdminUser.id}`);
      console.log(`   Email: ${oldAdminUser.email}`);
      console.log(`   Name: ${oldAdminUser.name}`);
      console.log(`   Role: ${oldAdminUser.role}`);
    } else {
      console.log('✅ Old admin user (admin@lettex.com) has been removed');
    }
    
    // List all users
    const allUsers = await prisma.user.findMany();
    console.log(`\nTotal users in database: ${allUsers.length}`);
    allUsers.forEach(user => {
      console.log(`- ${user.email} (${user.role})`);
    });
    
  } catch (error) {
    console.error('Error checking admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });