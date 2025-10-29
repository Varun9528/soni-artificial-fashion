// Test product creation with the real database
const { db, enableRealDatabase } = require('./src/lib/database/connection');

// Enable real database
enableRealDatabase();

async function testProductCreation() {
  try {
    console.log('Testing product creation...');
    
    // Dynamically import server-side database operations
    const { serverDb } = await import('./src/lib/database/server-db.js');
    
    const productData = {
      id: `prod-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: { en: 'Test Product', hi: 'टेस्ट प्रोडक्ट' },
      slug: 'test-product-' + Date.now(),
      description: { en: 'Test product description', hi: 'टेस्ट प्रोडक्ट विवरण' },
      price: 100,
      originalPrice: 150,
      stock: 10,
      categoryId: '1', // Assuming category 1 exists
      artisanId: '1', // Assuming artisan 1 exists
      rating: 0,
      reviewCount: 0,
      featured: false,
      bestSeller: false,
      newArrival: false,
      trending: false,
      isActive: true,
      images: ['/images/test.jpg'],
      imageFilenames: ['test.jpg'],
      materials: [],
      colors: [],
      tags: []
    };

    const result = await serverDb.createProduct(productData);
    console.log('Product created successfully:', result);
  } catch (error) {
    console.error('Error creating product:', error);
  }
}

testProductCreation();