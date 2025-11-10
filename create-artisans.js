const mysql = require('mysql2/promise');

// Hostinger database configuration
const config = {
  host: 'auth-db1555.hstgr.io',
  user: 'u632940212_u632940212_fas',
  password: 'Soni@2k25$$',
  database: 'u632940212_u632940212_son',
  port: 3306
};

async function createArtisans() {
  let connection;
  
  try {
    // Connect to the database
    connection = await mysql.createConnection(config);
    console.log('Connected to Hostinger database successfully!');
    
    // Create artisans
    const artisans = [
      ['art-001', 'Soni Designer', 'soni-designer', JSON.stringify({en: 'Master craftsman with 15 years of experience in jewelry making', hi: '15 वर्षों के आभूषण बनाने के अनुभव वाले मास्टर कारीगर'}), 'Delhi', 'Delhi', 'Delhi', null, 15, 4.9, 0, 1],
      ['art-002', 'Priya Crafts', 'priya-crafts', JSON.stringify({en: 'Skilled artisan specializing in traditional jewelry designs', hi: 'पारंपरिक आभूषण डिज़ाइन में विशेषज्ञ कारीगर'}), 'Mumbai', 'Mumbai', 'Maharashtra', null, 12, 4.7, 0, 1]
    ];
    
    for (const artisan of artisans) {
      try {
        const artisanQuery = `
          INSERT INTO artisans (id, name, slug, bio, village, district, state, photo, experience, rating, totalProducts, isActive, joinedAt, createdAt, updatedAt)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), NOW())
        `;
        await connection.execute(artisanQuery, artisan);
        console.log(`✅ Created artisan: ${artisan[1]}`);
      } catch (error) {
        console.log(`Error creating artisan:`, error.message);
      }
    }
    
    await connection.end();
    console.log('✅ Database connection closed');
    
  } catch (error) {
    console.error('❌ Artisan creation failed:');
    console.error('Error message:', error.message);
    
    if (connection) {
      await connection.end().catch(() => {});
    }
  }
}

createArtisans();