const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Read .env.local file
const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

// Parse database credentials
const dbUser = envContent.match(/DB_USER="(.*)"/)?.[1] || 'root';
const dbPassword = envContent.match(/DB_PASSWORD="(.*)"/)?.[1] || '';
const dbName = envContent.match(/DB_NAME="(.*)"/)?.[1] || 'pachmarhi';

console.log('🌱 Seeding MySQL database for Pachmarhi Marketplace...');
console.log(`User: ${dbUser}, Database: ${dbName}`);

try {
  // Check if seed.sql exists
  const seedPath = path.join(__dirname, 'database', 'seed.sql');
  if (fs.existsSync(seedPath)) {
    // Apply seed data using SQL file
    console.log('📋 Applying seed data from SQL file...');
    const seedCmd = `mysql -u ${dbUser} ${dbPassword ? `-p${dbPassword}` : ''} ${dbName} < "${seedPath}"`;
    execSync(seedCmd, { stdio: 'inherit' });
    console.log('✅ Seed data applied successfully!');
  } else if (fs.existsSync(path.join(__dirname, 'database', 'seed.js'))) {
    // Run seed script
    console.log('📋 Running seed script...');
    const seedCmd = `node "${path.join(__dirname, 'database', 'seed.js')}"`;
    execSync(seedCmd, { stdio: 'inherit' });
    console.log('✅ Seed script executed successfully!');
  } else {
    console.log('⚠️ No seed files found. Skipping seeding.');
  }
} catch (error) {
  console.error('❌ Failed to seed database:', error.message);
  process.exit(1);
}