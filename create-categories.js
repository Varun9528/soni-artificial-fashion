const mysql = require('mysql2/promise');

// Hostinger database configuration
const config = {
  host: 'auth-db1555.hstgr.io',
  user: 'u632940212_u632940212_fas',
  password: 'Soni@2k25$$',
  database: 'u632940212_u632940212_son',
  port: 3306
};

async function createCategories() {
  let connection;
  
  try {
    // Connect to the database
    connection = await mysql.createConnection(config);
    console.log('Connected to Hostinger database successfully!');
    
    // Create jewelry categories
    const categories = [
      ['cat-001', JSON.stringify({en: 'Jewelry', hi: 'आभूषण'}), 'jewelry', JSON.stringify({en: 'Beautiful artificial jewelry crafted with precision and elegance', hi: 'सुंदर कृत्रिम आभूषण जो परिशुद्धता और सौंदर्य के साथ बनाया गया है'}), '/images/categories/jewelry.jpg', 1, 1, 0, 1],
      ['cat-002', JSON.stringify({en: 'Necklaces', hi: 'हार'}), 'necklaces', JSON.stringify({en: 'Elegant necklaces for every occasion', hi: 'प्रत्येक अवसर के लिए सुरुचिपूर्ण हार'}), '/images/categories/necklaces.jpg', 1, 1, 0, 2],
      ['cat-003', JSON.stringify({en: 'Earrings', hi: 'कान के आभूषण'}), 'earrings', JSON.stringify({en: 'Stylish earrings to complement your look', hi: 'आपके स्वरूप को पूरा करने के लिए फैशनेबल कान के आभूषण'}), '/images/categories/earrings.jpg', 1, 1, 0, 3]
    ];
    
    for (const category of categories) {
      try {
        const categoryQuery = `
          INSERT INTO categories (id, name, slug, description, image, featured, isActive, productCount, sortOrder, createdAt, updatedAt)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
        `;
        await connection.execute(categoryQuery, category);
        console.log(`✅ Created category: ${JSON.parse(category[1]).en}`);
      } catch (error) {
        console.log(`Error creating category:`, error.message);
      }
    }
    
    await connection.end();
    console.log('✅ Database connection closed');
    
  } catch (error) {
    console.error('❌ Category creation failed:');
    console.error('Error message:', error.message);
    
    if (connection) {
      await connection.end().catch(() => {});
    }
  }
}

createCategories();