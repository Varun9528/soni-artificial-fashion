const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function applySeed() {
  console.log('🌱 Applying seed data to database...');
  
  try {
    // Create connection to the database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: process.env.DB_PORT || 3306,
      database: 'pachmarhi_marketplace_final'
    });
    
    // Read the seed SQL file
    const seedPath = path.join(__dirname, 'database', 'seed.sql');
    if (!fs.existsSync(seedPath)) {
      console.log('⚠️  Seed SQL file not found. Run database/seed.js first.');
      await connection.end();
      return;
    }
    
    const seedSQL = fs.readFileSync(seedPath, 'utf8');
    
    // Split SQL into statements (be careful with semicolons in data)
    const statements = seedSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
    
    // Execute each statement
    for (const statement of statements) {
      if (statement.trim() !== '') {
        try {
          await connection.execute(statement);
          console.log(`✅ Executed: ${statement.substring(0, 50)}...`);
        } catch (err) {
          if (!err.message.includes('Duplicate entry') && 
              !err.message.includes('already exists') && 
              !err.message.includes('Unknown table')) {
            console.log(`⚠️  Warning: ${err.message}`);
          }
        }
      }
    }
    
    await connection.end();
    console.log('✅ Seed data applied successfully!');
    
  } catch (error) {
    console.error('❌ Seed application failed:', error.message);
  }
}

// Load environment variables
require('dotenv').config({ path: '.env.local' });

applySeed();