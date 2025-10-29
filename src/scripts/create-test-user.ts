import bcrypt from 'bcryptjs';
import mysql from 'mysql2/promise';

// Database configuration from environment variables
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'soni_artificial_fashion',
  port: parseInt(process.env.DB_PORT || '3306')
};

async function createTestUser() {
  const pool = mysql.createPool(dbConfig);
  
  try {
    // Check if user already exists
    const [existingUsers] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      ['user@soniartificialfashion.com']
    );
    
    if ((existingUsers as any[]).length > 0) {
      console.log('Test user already exists');
      return;
    }
    
    // Hash the password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash('user123', saltRounds);
    
    // Create the user
    const userId = `user-${Date.now()}`;
    const [result] = await pool.execute(
      `INSERT INTO users (id, email, password_hash, name, phone, role, email_verified, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        userId,
        'user@soniartificialfashion.com',
        password_hash,
        'Test User',
        '+919876543210',
        'customer',
        1 // email_verified
      ]
    );
    
    console.log('Test user created successfully');
    console.log('Email: user@soniartificialfashion.com');
    console.log('Password: user123');
    
  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    await pool.end();
  }
}

createTestUser();