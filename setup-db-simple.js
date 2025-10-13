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
    await connection.execute(`CREATE DATABASE IF NOT EXISTS pachmarhi`);
    console.log('✅ Database created successfully!');
    
    // Connect to the new database
    await connection.end();
    
    const dbConnection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: process.env.DB_PORT || 3306,
      database: 'pachmarhi'
    });
    
    // Create a simple users table for testing
    console.log('📋 Creating users table...');
    await dbConnection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'customer',
        email_verified BOOLEAN DEFAULT FALSE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    console.log('✅ Users table created successfully!');
    
    // Insert default admin user
    console.log('👤 Creating default admin user...');
    await dbConnection.execute(`
      INSERT IGNORE INTO users (id, email, password_hash, name, role, email_verified) 
      VALUES ('admin-001', 'admin@pachmarhi.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeD2WBLBfp3cQ3T/a', 'Admin User', 'super_admin', TRUE)
    `);
    
    console.log('✅ Default admin user created successfully!');
    
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