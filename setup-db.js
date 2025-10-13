const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Read .env.local file
const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

// Parse database credentials
const dbHost = envContent.match(/DB_HOST="(.*)"/)?.[1] || 'localhost';
const dbUser = envContent.match(/DB_USER="(.*)"/)?.[1] || 'root';
const dbPassword = envContent.match(/DB_PASSWORD="(.*)"/)?.[1] || '';
const dbName = envContent.match(/DB_NAME="(.*)"/)?.[1] || 'pachmarhi';
const dbPort = envContent.match(/DB_PORT="(.*)"/)?.[1] || '3306';

console.log('🗄️ Setting up MySQL database for Pachmarhi Marketplace...');
console.log(`Host: ${dbHost}, User: ${dbUser}, Database: ${dbName}`);

try {
  // Create database
  console.log('📊 Creating database...');
  const createDbCmd = `mysql -h ${dbHost} -P ${dbPort} -u ${dbUser} ${dbPassword ? `-p${dbPassword}` : ''} -e "CREATE DATABASE IF NOT EXISTS \`${dbName}\`;"`;
  execSync(createDbCmd, { stdio: 'inherit' });
  console.log('✅ Database created successfully!');
} catch (error) {
  console.error('❌ Failed to create database:', error.message);
  process.exit(1);
}

console.log('✅ Database setup complete!');