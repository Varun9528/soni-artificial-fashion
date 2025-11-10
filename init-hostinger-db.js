const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

// Hostinger database configuration
const config = {
  host: 'auth-db1555.hstgr.io',
  user: 'u632940212_u632940212_fas',
  password: 'Soni@2k25$$',
  database: 'u632940212_u632940212_son',
  port: 3306
};

async function initDatabase() {
  let connection;
  
  try {
    // Connect to the database
    connection = await mysql.createConnection(config);
    console.log('Connected to Hostinger database successfully!');
    
    // Read and execute the initial migration
    const migrationFiles = [
      'prisma/migrations/20251002055339_init/migration.sql',
      'prisma/migrations/20251002084027_add_notifications/migration.sql',
      'prisma/migrations/20251002084839_add_shipping_options/migration.sql',
      'prisma/migrations/20251002090039_add_coupons/migration.sql',
      'prisma/migrations/20251010113429_init/migration.sql'
    ];
    
    for (const migrationFile of migrationFiles) {
      try {
        const migrationPath = path.join(__dirname, migrationFile);
        const sql = await fs.readFile(migrationPath, 'utf8');
        
        // Split the SQL into individual statements
        const statements = sql.split(';').filter(stmt => stmt.trim() !== '');
        
        for (const statement of statements) {
          if (statement.trim() !== '') {
            try {
              await connection.execute(statement);
              console.log(`✅ Executed: ${statement.substring(0, 50)}...`);
            } catch (stmtError) {
              // Ignore duplicate table errors as they're expected when re-running migrations
              if (!stmtError.message.includes('already exists') && 
                  !stmtError.message.includes('Duplicate column') &&
                  !stmtError.message.includes('duplicate column')) {
                console.warn(`⚠️  Statement warning (may be expected): ${stmtError.message}`);
              }
            }
          }
        }
        
        console.log(`✅ Completed migration: ${migrationFile}`);
      } catch (fileError) {
        console.error(`❌ Error reading migration file ${migrationFile}:`, fileError.message);
      }
    }
    
    console.log('✅ All migrations completed successfully!');
    
    await connection.end();
    console.log('✅ Database connection closed');
    
  } catch (error) {
    console.error('❌ Database initialization failed:');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    if (connection) {
      await connection.end().catch(() => {});
    }
  }
}

initDatabase();