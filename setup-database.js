const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
  console.log('🗄️ Setting up MySQL database for Pachmarhi Marketplace...');
  
  try {
    // Create connection without specifying database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: process.env.DB_PORT || 3306
    });
    
    // Create database
    console.log('📊 Creating database...');
    await connection.execute(`CREATE DATABASE IF NOT EXISTS pachmarhi_marketplace_final`);
    console.log('✅ Database created successfully!');
    
    // Connect to the new database
    await connection.end();
    
    const dbConnection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: process.env.DB_PORT || 3306,
      database: 'pachmarhi_marketplace_final'
    });
    
    // Read and execute schema
    console.log('📋 Applying database schema...');
    const schemaPath = path.join(__dirname, 'database', 'schema-simple.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split schema into individual statements
    const statements = schema.split(';').filter(stmt => stmt.trim() !== '');
    
    for (const statement of statements) {
      if (statement.trim() !== '') {
        try {
          await dbConnection.execute(statement);
        } catch (err) {
          // Ignore errors for CREATE TABLE IF NOT EXISTS statements that might fail
          if (!err.message.includes('already exists') && !err.message.includes('duplicate')) {
            console.log(`⚠️  Warning: ${err.message}`);
          }
        }
      }
    }
    
    console.log('✅ Schema applied successfully!');
    
    // Run seed data
    console.log('🌱 Seeding database...');
    const seedPath = path.join(__dirname, 'database', 'seed.js');
    
    if (fs.existsSync(seedPath)) {
      try {
        // Execute seed script
        const { execSync } = require('child_process');
        execSync(`node "${seedPath}"`, { stdio: 'inherit' });
        console.log('✅ Database seeding completed!');
      } catch (seedError) {
        console.log('⚠️  Seeding failed:', seedError.message);
        console.log('Please run manually: node database/seed.js');
      }
    } else {
      console.log('⚠️  Seed file not found at database/seed.js');
    }
    
    await dbConnection.end();
    console.log('✅ Database setup complete!');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.log('Please make sure MySQL is running and credentials are correct.');
  }
}

// Load environment variables
require('dotenv').config({ path: '.env.local' });

setupDatabase();