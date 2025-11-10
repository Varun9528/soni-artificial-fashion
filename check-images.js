import mysql from 'mysql2/promise';

async function checkDatabaseImages() {
  try {
    // Create a connection to the database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'soni_artificial_fashion',
      port: parseInt(process.env.DB_PORT || '3306')
    });

    console.log('Connected to the database successfully!');

    // Check product images
    console.log('\n=== Product Images ===');
    const [products] = await connection.execute('SELECT id, slug, title_en FROM products LIMIT 5');
    for (const product of products) {
      console.log(`Product: ${product.title_en} (${product.slug})`);
      const [images] = await connection.execute('SELECT * FROM product_images WHERE product_id = ?', [product.id]);
      for (const image of images) {
        console.log(`  Image: ${image.image_url}`);
      }
    }

    // Check banner images
    console.log('\n=== Banner Images ===');
    const [banners] = await connection.execute('SELECT * FROM banners LIMIT 5');
    for (const banner of banners) {
      console.log(`Banner: ${banner.title_en}`);
      console.log(`  Desktop: ${banner.image_desktop}`);
      console.log(`  Mobile: ${banner.image_mobile}`);
    }

    // Check category images
    console.log('\n=== Category Images ===');
    const [categories] = await connection.execute('SELECT * FROM categories LIMIT 5');
    for (const category of categories) {
      console.log(`Category: ${category.name_en}`);
      console.log(`  Image: ${category.image}`);
    }

    await connection.end();
  } catch (error) {
    console.error('Database error:', error);
  }
}

checkDatabaseImages();