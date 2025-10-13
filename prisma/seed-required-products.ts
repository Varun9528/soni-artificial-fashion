import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database cleanup and seeding with required products only...');

  // Delete all existing data in correct order to avoid foreign key constraints
  await prisma.productImage.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.artisan.deleteMany({});
  await prisma.banner.deleteMany({});
  await prisma.user.deleteMany({});
  
  console.log('Deleted all existing data');

  // Create admin user for Lettex
  const adminUser = await prisma.user.create({
    data: {
      id: 'admin-001',
      email: 'admin@lettex.com',
      password_hash: '$2a$12$TVb7ROjbz2CJFo3K71MBGunOtW7G7NUJhIk0p6aWK4aVQJ0CaCYsO', // admin123
      name: 'Admin User',
      role: 'super_admin',
      email_verified: true,
      created_at: new Date(),
      updated_at: new Date()
    }
  });
  console.log('Created admin user:', adminUser.email);

  // Create categories for Lettex products
  const categories = [
    {
      id: 'cat-001',
      name_en: 'Grocery',
      name_hi: 'किराना',
      description_en: 'Fresh grocery and daily needs products',
      description_hi: 'ताजा किराना और दैनिक आवश्यकता के उत्पाद',
      image: '/images/categories/cat-grocery.jpg',
      display_order: 1,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 'cat-002',
      name_en: 'Dairy Products',
      name_hi: 'डेयरी उत्पाद',
      description_en: 'Fresh milk and dairy products',
      description_hi: 'ताजा दूध और डेयरी उत्पाद',
      image: '/images/categories/cat-dairy.jpg',
      display_order: 2,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 'cat-003',
      name_en: 'Own Brand',
      name_hi: 'अपना ब्रांड',
      description_en: 'Our own brand products',
      description_hi: 'हमारे अपने ब्रांड के उत्पाद',
      image: '/images/categories/cat-own-brand.jpg',
      display_order: 3,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    }
  ];

  for (const categoryData of categories) {
    const category = await prisma.category.create({
      data: categoryData
    });
    console.log('Created category:', category.name_en);
  }

  // Create only the required products from the screenshot
  const requiredProducts = [
    {
      id: 'prod-001',
      name: 'Tamarind Candy',
      slug: 'tamarind-candy',
      description_en: 'Authentic Tamarind Candy from Lettex',
      description_hi: 'लेटेक्स से प्रामाणिक इमली कैंडी',
      price: new Prisma.Decimal(150),
      original_price: new Prisma.Decimal(200),
      stock: 25,
      category_id: 'cat-001',
      image_path: '/uploads/products/Tamarind_Candy.jpg'
    },
    {
      id: 'prod-002',
      name: 'Amla Candy',
      slug: 'amla-candy',
      description_en: 'Authentic Amla Candy from Lettex',
      description_hi: 'लेटेक्स से प्रामाणिक आमला कैंडी',
      price: new Prisma.Decimal(140),
      original_price: new Prisma.Decimal(180),
      stock: 30,
      category_id: 'cat-001',
      image_path: '/uploads/products/Amla_Candy.jpg'
    },
    {
      id: 'prod-003',
      name: 'Jungle Honey',
      slug: 'jungle-honey',
      description_en: 'Pure Jungle Honey from Lettex',
      description_hi: 'लेटेक्स से शुद्ध जंगली शहद',
      price: new Prisma.Decimal(350),
      original_price: new Prisma.Decimal(450),
      stock: 15,
      category_id: 'cat-001',
      image_path: '/uploads/products/Jungle_Honey.jpg'
    },
    {
      id: 'prod-004',
      name: 'Baheda Powder',
      slug: 'baheda-powder',
      description_en: 'Natural Baheda Powder from Lettex',
      description_hi: 'लेटेक्स से प्राकृतिक बहेड़ा पाउडर',
      price: new Prisma.Decimal(120),
      original_price: new Prisma.Decimal(160),
      stock: 40,
      category_id: 'cat-001',
      image_path: '/uploads/products/Baheda_Powder.jpg'
    },
    {
      id: 'prod-005',
      name: 'Harada Powder',
      slug: 'harada-powder',
      description_en: 'Natural Harada Powder from Lettex',
      description_hi: 'लेटेक्स से प्राकृतिक हरड़ा पाउडर',
      price: new Prisma.Decimal(110),
      original_price: new Prisma.Decimal(150),
      stock: 35,
      category_id: 'cat-001',
      image_path: '/uploads/products/Harada_Powder.jpg'
    },
    {
      id: 'prod-006',
      name: 'Triphala Powder',
      slug: 'triphala-powder',
      description_en: 'Organic Triphala Powder from Lettex',
      description_hi: 'लेटेक्स से जैविक त्रिफला पाउडर',
      price: new Prisma.Decimal(180),
      original_price: new Prisma.Decimal(240),
      stock: 20,
      category_id: 'cat-001',
      image_path: '/uploads/products/Triphala_Powder.jpg'
    },
    {
      id: 'prod-007',
      name: 'Herbal Gulal',
      slug: 'herbal-gulal',
      description_en: 'Natural Herbal Gulal from Lettex',
      description_hi: 'लेटेक्स से प्राकृतिक हर्बल गुलाल',
      price: new Prisma.Decimal(80),
      original_price: new Prisma.Decimal(120),
      stock: 50,
      category_id: 'cat-001',
      image_path: '/uploads/products/Herbal_Gulal.jpg'
    },
    {
      id: 'prod-008',
      name: 'Handmade Soap',
      slug: 'handmade-soap',
      description_en: 'Natural Handmade Soap from Lettex',
      description_hi: 'लेटेक्स से प्राकृतिक हस्तनिर्मित साबुन',
      price: new Prisma.Decimal(90),
      original_price: new Prisma.Decimal(130),
      stock: 45,
      category_id: 'cat-001',
      image_path: '/uploads/products/Handmade_Soap.jpg'
    },
    {
      id: 'prod-009',
      name: 'Mahua Laddu',
      slug: 'mahua-laddu',
      description_en: 'Traditional Mahua Laddu from Lettex',
      description_hi: 'लेटेक्स से पारंपरिक महुआ लड्डू',
      price: new Prisma.Decimal(200),
      original_price: new Prisma.Decimal(250),
      stock: 20,
      category_id: 'cat-001',
      image_path: '/uploads/products/Mahua_Laddu.jpg'
    },
    {
      id: 'prod-010',
      name: 'Gond Painting',
      slug: 'gond-painting',
      description_en: 'Traditional Gond Painting from Lettex',
      description_hi: 'लेटेक्स से पारंपरिक गोंड चित्रकला',
      price: new Prisma.Decimal(450),
      original_price: new Prisma.Decimal(600),
      stock: 10,
      category_id: 'cat-001',
      image_path: '/uploads/products/Gond_Painting.jpg'
    }
  ];

  console.log(`Creating ${requiredProducts.length} required products...`);

  for (const productData of requiredProducts) {
    try {
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

  console.log('Seeding completed successfully with required products only!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });