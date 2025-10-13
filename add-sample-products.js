const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');

async function addSampleProducts() {
  try {
    // Create connection to the database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: process.env.DB_PORT || 3306,
      database: 'pachmarhi_marketplace_final'
    });
    
    console.log('✅ Database connection successful!');
    
    // Get categories and artisans for foreign keys
    const [categories] = await connection.execute('SELECT id FROM categories');
    const [artisans] = await connection.execute('SELECT id FROM artisans');
    
    if (categories.length === 0 || artisans.length === 0) {
      console.log('⚠️  No categories or artisans found. Please seed the database first.');
      await connection.end();
      return;
    }
    
    // Sample products data
    const products = [
      {
        name: 'Bamboo Wall Art',
        slug: 'bamboo-wall-art',
        description: 'Beautiful handcrafted bamboo wall art featuring traditional tribal motifs.',
        price: 1299.00,
        originalPrice: 1499.00,
        sku: 'BWA001',
        stock: 15,
        material: 'Natural Bamboo',
        categoryId: categories[0].id,
        artisanId: artisans[0].id,
        rating: 4.5,
        reviewCount: 12,
        tags: 'bamboo,wall-art,decorative'
      },
      {
        name: 'Tribal Silver Necklace',
        slug: 'tribal-silver-necklace',
        description: 'Handcrafted silver tribal necklace with traditional design.',
        price: 899.00,
        originalPrice: 999.00,
        sku: 'TSN001',
        stock: 8,
        material: 'Sterling Silver',
        categoryId: categories[2].id, // jewelry
        artisanId: artisans[1].id,
        rating: 4.7,
        reviewCount: 8,
        tags: 'silver,jewelry,tribal'
      },
      {
        name: 'Gond Painting',
        slug: 'gond-painting',
        description: 'Traditional Gond painting depicting nature and wildlife.',
        price: 3499.00,
        originalPrice: 3999.00,
        sku: 'GP001',
        stock: 6,
        material: 'Canvas, Acrylic Paint',
        categoryId: categories[5].id, // art-paintings
        artisanId: artisans[2].id,
        rating: 4.7,
        reviewCount: 18,
        tags: 'gond,painting,art,canvas'
      },
      {
        name: 'Handloom Sari',
        slug: 'handloom-sari',
        description: 'Exquisite handloom sari woven with traditional patterns.',
        price: 4999.00,
        originalPrice: 5999.00,
        sku: 'HS001',
        stock: 12,
        material: 'Pure Cotton',
        categoryId: categories[1].id, // handloom-textiles
        artisanId: artisans[0].id,
        rating: 4.8,
        reviewCount: 22,
        tags: 'handloom,sari,cotton,traditional'
      }
    ];
    
    // Insert products
    for (const product of products) {
      const productId = uuidv4();
      
      const insertProductSQL = `
        INSERT INTO products (
          id, slug, title_en, title_hi, description_en, description_hi,
          price, original_price, sku, stock, material, category_id, artisan_id,
          rating, review_count, tags, featured, best_seller, is_active
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      await connection.execute(insertProductSQL, [
        productId,
        product.slug,
        product.name,
        product.name, // title_hi (using English for simplicity)
        product.description,
        product.description, // description_hi (using English for simplicity)
        product.price,
        product.originalPrice,
        product.sku,
        product.stock,
        product.material,
        product.categoryId,
        product.artisanId,
        product.rating,
        product.reviewCount,
        product.tags,
        true, // featured
        true, // best_seller
        true  // is_active
      ]);
      
      console.log(`✅ Added product: ${product.name}`);
      
      // Add product images
      const insertImageSQL = `
        INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      
      const imageId = uuidv4();
      await connection.execute(insertImageSQL, [
        imageId,
        productId,
        `/uploads/products/${product.slug}/img1.jpg`,
        `${product.name} - Main Image`,
        0,
        true
      ]);
      
      console.log(`  🖼️  Added image for: ${product.name}`);
    }
    
    await connection.end();
    console.log('\n✅ Sample products added successfully!');
    
  } catch (error) {
    console.error('❌ Failed to add sample products:', error.message);
  }
}

// Load environment variables and run
require('dotenv').config({ path: '.env.local' });

// Install uuid if not already installed
try {
  require('uuid');
  addSampleProducts();
} catch (e) {
  console.log('Installing uuid package...');
  const { execSync } = require('child_process');
  execSync('npm install uuid', { stdio: 'inherit' });
  addSampleProducts();
}