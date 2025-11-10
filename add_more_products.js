const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addMoreProducts() {
  try {
    // Add more men's products
    const mensProducts = [
      {
        id: 'prod-013',
        slug: 'gold-cufflinks-men',
        title_en: 'Gold Cufflinks for Men',
        title_hi: 'पुरुषों के लिए सोने के कफलिंक्स',
        description_en: 'Elegant gold-plated cufflinks for formal occasions',
        description_hi: 'औपचारिक अवसरों के लिए फैशनेबल सोने के कफलिंक्स',
        price: 1299.00,
        original_price: 1799.00,
        stock: 20,
        category_id: 'cat-006',
        artisan_id: 'art-001',
        image_path: '/images/mens product/Gold_Cufflinks_Marble_Macro_Luxury.png'
      },
      {
        id: 'prod-014',
        slug: 'gold-money-clip-men',
        title_en: 'Gold Money Clip',
        title_hi: 'गोल्ड मनी क्लिप',
        description_en: 'Luxury gold-plated money clip for men',
        description_hi: 'पुरुषों के लिए लक्ज़री सोने की प्लेटेड मनी क्लिप',
        price: 899.00,
        original_price: 1299.00,
        stock: 25,
        category_id: 'cat-006',
        artisan_id: 'art-001',
        image_path: '/images/mens product/Gold_Money_Clip_Luxury_Macro.png'
      },
      {
        id: 'prod-015',
        slug: 'gold-signet-ring-men',
        title_en: 'Gold Signet Ring',
        title_hi: 'गोल्ड सिग्नेट रिंग',
        description_en: 'Classic gold-plated signet ring for men',
        description_hi: 'पुरुषों के लिए क्लासिक सोने की प्लेटेड सिग्नेट रिंग',
        price: 2199.00,
        original_price: 2999.00,
        stock: 15,
        category_id: 'cat-006',
        artisan_id: 'art-001',
        image_path: '/images/mens product/Gold_Signet_Ring_Marble_Macro.png'
      }
    ];

    // Add more women's products
    const womensProducts = [
      {
        id: 'prod-016',
        slug: 'gold-anklet-women',
        title_en: 'Gold Anklet',
        title_hi: 'गोल्ड पांव की चैन',
        description_en: 'Beautiful gold-plated anklet for women',
        description_hi: 'महिलाओं के लिए सुंदर सोने की प्लेटेड पांव की चैन',
        price: 1499.00,
        original_price: 1999.00,
        stock: 18,
        category_id: 'cat-007',
        artisan_id: 'art-001',
        image_path: '/images/products/Gold_Anklet_Traditional_Soni_a677.png'
      },
      {
        id: 'prod-017',
        slug: 'gold-hairpin-women',
        title_en: 'Gold Hairpin',
        title_hi: 'गोल्ड हेयरपिन',
        description_en: 'Elegant gold-plated hairpin for women',
        description_hi: 'महिलाओं के लिए फैशनेबल सोने की हेयरपिन',
        price: 799.00,
        original_price: 1199.00,
        stock: 30,
        category_id: 'cat-007',
        artisan_id: 'art-001',
        image_path: '/images/products/Gold_Hairpin_hp123_Soni_Fashion.png'
      },
      {
        id: 'prod-018',
        slug: 'gold-nose-ring-women',
        title_en: 'Gold Nose Ring',
        title_hi: 'गोल्ड नाक की चैन',
        description_en: 'Traditional gold-plated nose ring for women',
        description_hi: 'महिलाओं के लिए पारंपरिक सोने की नाक की चैन',
        price: 999.00,
        original_price: 1499.00,
        stock: 22,
        category_id: 'cat-007',
        artisan_id: 'art-001',
        image_path: '/images/products/Gold_Nose_Ring.png'
      }
    ];

    // Insert all products
    for (const product of [...mensProducts, ...womensProducts]) {
      try {
        // Try to create the product
        await prisma.product.create({
          data: {
            id: product.id,
            slug: product.slug,
            title_en: product.title_en,
            title_hi: product.title_hi,
            description_en: product.description_en,
            description_hi: product.description_hi,
            price: product.price,
            original_price: product.original_price,
            stock: product.stock,
            category_id: product.category_id,
            artisan_id: product.artisan_id,
            is_active: true,
            featured: false,
            best_seller: false,
            new_arrival: false,
            trending: false,
            created_at: new Date(),
            updated_at: new Date()
          }
        });

        // Add product image
        await prisma.$executeRaw`
          INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary, created_at)
          VALUES (${`img-${product.id.split('-')[1]}`}, ${product.id}, ${product.image_path}, ${product.title_en}, ${0}, ${1}, ${new Date()})
        `;
        
        console.log(`Added product: ${product.title_en}`);
      } catch (error) {
        if (error.code === 'P2002') {
          console.log(`Product ${product.id} already exists, skipping...`);
        } else {
          console.error(`Error adding product ${product.id}:`, error);
        }
      }
    }

    console.log('Finished processing products');
  } catch (error) {
    console.error('Error adding products:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addMoreProducts();