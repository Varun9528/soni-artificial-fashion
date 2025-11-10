const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixProductImages() {
  try {
    // Insert images for prod-013
    await prisma.$executeRaw`
      INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary, created_at) 
      VALUES ('img-013', 'prod-013', '/images/mens product/Gold_Cufflinks_Marble_Macro_Luxury.png', 'Gold Cufflinks for Men', 0, 1, NOW())
    `;
    
    // Insert images for prod-014
    await prisma.$executeRaw`
      INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary, created_at) 
      VALUES ('img-014', 'prod-014', '/images/mens product/Gold_Money_Clip_Luxury_Macro.png', 'Gold Money Clip', 0, 1, NOW())
    `;
    
    // Insert images for prod-015
    await prisma.$executeRaw`
      INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary, created_at) 
      VALUES ('img-015', 'prod-015', '/images/mens product/Gold_Signet_Ring_Marble_Macro.png', 'Gold Signet Ring', 0, 1, NOW())
    `;
    
    console.log('Successfully inserted missing product images');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

fixProductImages();