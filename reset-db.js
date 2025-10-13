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

console.log('🔄 Resetting MySQL database for Pachmarhi Marketplace...');
console.log(`User: ${dbUser}, Database: ${dbName}`);

try {
  // Drop database if exists
  console.log('🗑️ Dropping existing database...');
  const dropCmd = `mysql -u ${dbUser} ${dbPassword ? `-p${dbPassword}` : ''} -e "DROP DATABASE IF EXISTS \`${dbName}\`;"`;
  execSync(dropCmd, { stdio: 'inherit' });
  
  // Create database
  console.log('📊 Creating database...');
  const createCmd = `mysql -u ${dbUser} ${dbPassword ? `-p${dbPassword}` : ''} -e "CREATE DATABASE \`${dbName}\`;"`;
  execSync(createCmd, { stdio: 'inherit' });
  
  // Check if schema.sql exists
  const schemaPath = path.join(__dirname, 'database', 'schema.sql');
  if (!fs.existsSync(schemaPath)) {
    console.error('❌ Schema file not found at database/schema.sql');
    process.exit(1);
  }

  // Apply schema
  console.log('📋 Applying database schema...');
  const migrateCmd = `mysql -u ${dbUser} ${dbPassword ? `-p${dbPassword}` : ''} ${dbName} < "${schemaPath}"`;
  execSync(migrateCmd, { stdio: 'inherit' });
  console.log('✅ Database schema applied successfully!');
  
  // Check if seed.sql exists
  const seedPath = path.join(__dirname, 'database', 'seed.sql');
  if (fs.existsSync(seedPath)) {
    // Apply seed data using SQL file
    console.log('🌱 Applying seed data from SQL file...');
    const seedCmd = `mysql -u ${dbUser} ${dbPassword ? `-p${dbPassword}` : ''} ${dbName} < "${seedPath}"`;
    execSync(seedCmd, { stdio: 'inherit' });
    console.log('✅ Seed data applied successfully!');
  } else if (fs.existsSync(path.join(__dirname, 'database', 'seed.js'))) {
    // Run seed script
    console.log('🌱 Running seed script...');
    const seedCmd = `node "${path.join(__dirname, 'database', 'seed.js')}"`;
    execSync(seedCmd, { stdio: 'inherit' });
    console.log('✅ Seed script executed successfully!');
  } else {
    console.log('⚠️ No seed files found. Skipping seeding.');
  }
  
  console.log('✅ Database reset complete!');
} catch (error) {
  console.error('❌ Failed to reset database:', error.message);
  process.exit(1);
}