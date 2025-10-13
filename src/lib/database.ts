import mysql from 'mysql2/promise';

let connection: mysql.Connection | null = null;

export const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  port: parseInt(process.env.DB_PORT || '3306'),
  database: process.env.DB_NAME || 'lettex_db',
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '10'),
  acquireTimeout: parseInt(process.env.DB_ACQUIRE_TIMEOUT || '60000'),
  timeout: parseInt(process.env.DB_TIMEOUT || '60000')
};

export async function getConnection() {
  if (connection) {
    return connection;
  }

  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'lettex_db',
      port: parseInt(process.env.DB_PORT || '3306'),
    });

    console.log('✅ MySQL Database connected successfully');
    return connection;
  } catch (error) {
    console.error('❌ MySQL Database connection failed:', error);
    // Return null so the app can fall back to mock data
    return null;
  }
}

export async function executeQuery(query: string, params: any[] = []) {
  try {
    const conn = await getConnection();
    if (!conn) {
      console.warn('⚠️ No MySQL database connection, using mock data');
      return null;
    }

    const [results] = await conn.execute(query, params);
    return results;
  } catch (error) {
    console.error('MySQL Database query failed:', error);
    return null;
  }
}

// Test database connection on startup
export async function testConnection() {
  try {
    const conn = await getConnection();
    if (conn) {
      await conn.execute('SELECT 1');
      console.log('✅ MySQL Database test query successful');
      return true;
    }
    return false;
  } catch (error) {
    console.warn('⚠️ MySQL Database test failed, will use mock data:', error);
    return false;
  }
}