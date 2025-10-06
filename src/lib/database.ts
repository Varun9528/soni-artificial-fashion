import mysql from 'mysql2/promise';

let connection: mysql.Connection | null = null;

export async function getConnection() {
  if (connection) {
    return connection;
  }

  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'pachmarhi_db',
      port: parseInt(process.env.DB_PORT || '3306'),
    });

    console.log('✅ Database connected successfully');
    return connection;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    // Return null so the app can fall back to mock data
    return null;
  }
}

export async function executeQuery(query: string, params: any[] = []) {
  try {
    const conn = await getConnection();
    if (!conn) {
      console.warn('⚠️ No database connection, using mock data');
      return null;
    }

    const [results] = await conn.execute(query, params);
    return results;
  } catch (error) {
    console.error('Database query failed:', error);
    return null;
  }
}

// Test database connection on startup
export async function testConnection() {
  try {
    const conn = await getConnection();
    if (conn) {
      await conn.execute('SELECT 1');
      console.log('✅ Database test query successful');
      return true;
    }
    return false;
  } catch (error) {
    console.warn('⚠️ Database test failed, will use mock data:', error);
    return false;
  }
}