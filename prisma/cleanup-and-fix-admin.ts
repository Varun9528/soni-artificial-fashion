import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning up and fixing admin users...');
  
  try {
    // Delete all admin users
    const deletedUsers = await prisma.user.deleteMany({
      where: {
        OR: [
          { email: 'admin@lettex.com' },
          { email: 'admin@sonifashion.com' },
          { email: 'admin@soniartificialfashion.com' },
          { role: 'admin' },
          { role: 'super_admin' }
        ]
      }
    });
    
    console.log(`✅ Deleted ${deletedUsers.count} admin users`);
    
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
    
    // List all users
    const allUsers = await prisma.user.findMany();
    console.log(`\nTotal users in database: ${allUsers.length}`);
    allUsers.forEach(user => {
      console.log(`- ${user.email} (${user.role})`);
    });
    
    console.log('\n✅ Admin user cleanup and fix completed successfully!');
    
  } catch (error) {
    console.error('Error cleaning up and fixing admin users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });