import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Adding fashion accessories products...');

  // Fashion Accessories products from mens product folder
  const fashionAccessoriesProducts = [
    {
      id: 'prod-007',
      name: 'Gold Bracelet',
      slug: 'gold-bracelet',
      description_en: 'Stylish gold-plated bracelet for men',
      description_hi: 'पुरुषों के लिए स्टाइलिश सोने की प्लेटेड कंघाई',
      price: new Prisma.Decimal(1599),
      original_price: new Prisma.Decimal(2199),
      stock: 18,
      category_id: 'cat-001', // Fashion Accessories category (Jewelry)
      artisan_id: 'art-001',
      image_path: '/images/mens product/Gold_Bracelet_Marble_Macro_Luxury (2).png'
    },
    {
      id: 'prod-008',
      name: 'Gold Cufflinks',
      slug: 'gold-cufflinks',
      description_en: 'Elegant gold-plated cufflinks for formal occasions',
      description_hi: 'औपचारिक अवसरों के लिए सुरुचिपूर्ण सोने की प्लेटेड कफलिंक्स',
      price: new Prisma.Decimal(1299),
      original_price: new Prisma.Decimal(1799),
      stock: 22,
      category_id: 'cat-001', // Fashion Accessories category (Jewelry)
      artisan_id: 'art-002',
      image_path: '/images/mens product/Gold_Cufflinks_Marble_Macro_Luxury.png'
    },
    {
      id: 'prod-009',
      name: 'Gold Money Clip',
      slug: 'gold-money-clip',
      description_en: 'Elegant gold money clip for men',
      description_hi: 'पुरुषों के लिए सुरुचिपूर्ण सोने का मनी क्लिप',
      price: new Prisma.Decimal(899),
      original_price: new Prisma.Decimal(1299),
      stock: 25,
      category_id: 'cat-001', // Fashion Accessories category (Jewelry)
      artisan_id: 'art-001',
      image_path: '/images/mens product/Gold_Money_Clip_Luxury_Macro.png'
    },
    {
      id: 'prod-010',
      name: 'Gold Pendant',
      slug: 'gold-pendant',
      description_en: 'Stylish gold pendant for men',
      description_hi: 'पुरुषों के लिए स्टाइलिश सोने का पेंडेंट',
      price: new Prisma.Decimal(1799),
      original_price: new Prisma.Decimal(2499),
      stock: 15,
      category_id: 'cat-001', // Fashion Accessories category (Jewelry)
      artisan_id: 'art-002',
      image_path: '/images/mens product/Gold_Pendant_Marble_Luxury_Macro.png'
    },
    {
      id: 'prod-011',
      name: 'Gold Ring',
      slug: 'gold-ring',
      description_en: 'Traditional gold ring for men',
      description_hi: 'पुरुषों के लिए पारंपरिक सोने की अंगूठी',
      price: new Prisma.Decimal(2499),
      original_price: new Prisma.Decimal(3499),
      stock: 12,
      category_id: 'cat-001', // Fashion Accessories category (Jewelry)
      artisan_id: 'art-001',
      image_path: '/images/mens product/Gold_Ring_Logo_Watermark.png'
    },
    {
      id: 'prod-012',
      name: 'Luxury Gold Ring',
      slug: 'luxury-gold-ring',
      description_en: 'Luxury gold ring for men',
      description_hi: 'पुरुषों के लिए लक्ज़री सोने की अंगूठी',
      price: new Prisma.Decimal(3499),
      original_price: new Prisma.Decimal(4999),
      stock: 8,
      category_id: 'cat-001', // Fashion Accessories category (Jewelry)
      artisan_id: 'art-002',
      image_path: '/images/mens product/Gold_Rings_Marble_Luxury_Macro (1).png'
    },
    {
      id: 'prod-013',
      name: 'Gold Signet Ring',
      slug: 'gold-signet-ring',
      description_en: 'Classic gold signet ring for men',
      description_hi: 'पुरुषों के लिए क्लासिक सोने की सिग्नेट अंगूठी',
      price: new Prisma.Decimal(2999),
      original_price: new Prisma.Decimal(3999),
      stock: 10,
      category_id: 'cat-001', // Fashion Accessories category (Jewelry)
      artisan_id: 'art-001',
      image_path: '/images/mens product/Gold_Signet_Ring_Marble_Macro.png'
    },
    {
      id: 'prod-014',
      name: 'Gold Tie Clip',
      slug: 'gold-tie-clip',
      description_en: 'Elegant gold tie clip for men',
      description_hi: 'पुरुषों के लिए सुरुचिपूर्ण सोने का टाई क्लिप',
      price: new Prisma.Decimal(799),
      original_price: new Prisma.Decimal(1199),
      stock: 20,
      category_id: 'cat-001', // Fashion Accessories category (Jewelry)
      artisan_id: 'art-002',
      image_path: '/images/mens product/Gold_Tie_Clip_Marble_Luxury.png'
    },
    {
      id: 'prod-015',
      name: 'Luxury Gold Watch',
      slug: 'luxury-gold-watch',
      description_en: 'Luxury gold watch for men',
      description_hi: 'पुरुषों के लिए लक्ज़री सोने की घड़ी',
      price: new Prisma.Decimal(4499),
      original_price: new Prisma.Decimal(5999),
      stock: 6,
      category_id: 'cat-001', // Fashion Accessories category (Jewelry)
      artisan_id: 'art-001',
      image_path: '/images/mens product/Luxury_Gold_Watch_Marble_Macro.png'
    },
    {
      id: 'prod-016',
      name: 'Gold Pin',
      slug: 'gold-pin',
      description_en: 'Luxury gold pin for men',
      description_hi: 'पुरुषों के लिए लक्ज़री सोने का पिन',
      price: new Prisma.Decimal(1299),
      original_price: new Prisma.Decimal(1799),
      stock: 18,
      category_id: 'cat-001', // Fashion Accessories category (Jewelry)
      artisan_id: 'art-002',
      image_path: '/images/mens product/Opulent_Gold_Pin_Marble_Macro.png'
    }
  ];

  console.log(`Creating ${fashionAccessoriesProducts.length} fashion accessories products...`);

  for (const productData of fashionAccessoriesProducts) {
    try {
      // Check if product already exists
      const existingProduct = await prisma.product.findUnique({
        where: { id: productData.id }
      });

      if (existingProduct) {
        console.log(`Product ${productData.name} already exists, skipping...`);
        continue;
      }

      const product = await prisma.product.create({
        data: {
          id: productData.id,
          slug: productData.slug,
          title_en: productData.name,
          title_hi: productData.name,
          description_en: productData.description_en,
          description_hi: productData.description_hi,
          price: productData.price,
          original_price: productData.original_price,
          stock: productData.stock,
          category_id: productData.category_id,
          artisan_id: productData.artisan_id,
          created_at: new Date(),
          updated_at: new Date()
        }
      });

      // Create product image
      await prisma.productImage.create({
        data: {
          id: `img-${productData.id.substring(5)}`,
          product_id: product.id,
          image_url: productData.image_path,
          alt_text: productData.name,
          is_primary: true,
          created_at: new Date()
        }
      });

      console.log(`Created product: ${product.title_en} (${product.id})`);
    } catch (error: any) {
      console.error(`Error creating product ${productData.name}:`, error.message);
    }
  }

  console.log('Fashion accessories products added successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });