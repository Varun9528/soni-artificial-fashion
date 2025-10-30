import mysql from 'mysql2/promise';

export async function GET() {
  try {
    console.log('Attempting database connection...');
    
    // Log environment variables for debugging (without password)
    console.log('DB_HOST:', process.env.DB_HOST);
    console.log('DB_USER:', process.env.DB_USER);
    console.log('DB_NAME:', process.env.DB_NAME);
    console.log('DB_PORT:', process.env.DB_PORT);
    
    // Direct database connection test
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'soni_artificial_fashion',
      port: parseInt(process.env.DB_PORT || '3306')
    });
    
    console.log('Database connection successful!');
    
    // Test a simple query
    const [rows] = await connection.execute('SELECT 1 as test');
    await connection.end();
    
    console.log('Database query successful!');
    
    return Response.json({
      success: true,
      message: 'Database connection successful',
      testResult: rows
    });
  } catch (error: any) {
    console.error('Database connection error:', error);
    
    // Return detailed error information
    return Response.json({
      success: false,
      error: {
        message: error.message,
        code: error.code,
        errno: error.errno,
        sqlMessage: error.sqlMessage
      },
      message: 'Database connection failed'
    }, { status: 500 });
  }
}