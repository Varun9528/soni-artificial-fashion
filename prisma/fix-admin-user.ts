import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Fixing admin user...');
  
  try {
    // Delete the old admin user if it exists
    const oldAdminUser = await prisma.user.findUnique({
      where: { email: 'admin@lettex.com' }
    });
    
    if (oldAdminUser) {
      await prisma.user.delete({
        where: { email: 'admin@lettex.com' }
      });
      console.log('✅ Deleted old admin user (admin@lettex.com)');
    } else {
      console.log('ℹ️  Old admin user (admin@lettex.com) does not exist');
    }
    
    // Check if the correct admin user exists
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@soniartificialfashion.com' }
    });
    
    if (adminUser) {
      console.log('✅ Admin user already exists:');
      console.log(`   ID: ${adminUser.id}`);
      console.log(`   Email: ${adminUser.email}`);
      console.log(`   Name: ${adminUser.name}`);
      console.log(`   Role: ${adminUser.role}`);
    } else {
      // Create the correct admin user
      const newAdminUser = await prisma.user.create({
        data: {
          id: 'admin-001',
          email: 'admin@soniartificialfashion.com',
          password_hash: '$2a$12$TVb7ROjbz2CJFo3K71MBGunOtW7G7NUJhIk0p6aWK4aVQJ0CaCYsO', // admin123
          name: 'Admin User',
          role: 'super_admin',
          email_verified: true,
          created_at: new Date(),
          updated_at: new Date()
        }
      });
      
      console.log('✅ Created new admin user:');
      console.log(`   ID: ${newAdminUser.id}`);
      console.log(`   Email: ${newAdminUser.email}`);
      console.log(`   Name: ${newAdminUser.name}`);
      console.log(`   Role: ${newAdminUser.role}`);
    }
    
    // List all users
    const allUsers = await prisma.user.findMany();
    console.log(`\nTotal users in database: ${allUsers.length}`);
    allUsers.forEach(user => {
      console.log(`- ${user.email} (${user.role})`);
    });
    
    console.log('\n✅ Admin user fix completed successfully!');
    
  } catch (error) {
    console.error('Error fixing admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });