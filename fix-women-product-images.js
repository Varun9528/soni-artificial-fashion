const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixWomenProductImages() {
  try {
    // Insert images for prod-016
    await prisma.$executeRaw`
      INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary, created_at) 
      VALUES ('img-016', 'prod-016', '/images/products/Gold_Anklet_Traditional_Soni_a677.png', 'Gold Anklet', 0, 1, NOW())
    `;
    
    // Insert images for prod-017
    await prisma.$executeRaw`
      INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary, created_at) 
      VALUES ('img-017', 'prod-017', '/images/products/Gold_Hairpin_hp123_Soni_Fashion.png', 'Gold Hairpin', 0, 1, NOW())
    `;
    
    // Insert images for prod-018
    await prisma.$executeRaw`
      INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary, created_at) 
      VALUES ('img-018', 'prod-018', '/images/products/Gold_Nose_Ring.png', 'Gold Nose Ring', 0, 1, NOW())
    `;
    
    console.log('Successfully inserted missing women product images');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

fixWomenProductImages();