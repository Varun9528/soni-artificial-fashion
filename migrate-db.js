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

console.log('🗄️ Migrating MySQL database for Pachmarhi Marketplace...');
console.log(`User: ${dbUser}, Database: ${dbName}`);

try {
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
} catch (error) {
  console.error('❌ Failed to apply database schema:', error.message);
  process.exit(1);
}