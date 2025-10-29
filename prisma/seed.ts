import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database cleanup and seeding with jewelry products...');

  // Delete all existing data in correct order to avoid foreign key constraints
  await prisma.productImage.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.artisan.deleteMany({});
  await prisma.banner.deleteMany({});
  await prisma.user.deleteMany({});
  
  console.log('Deleted all existing data');

  // Create admin user for Soni Fashion
  const adminUser = await prisma.user.create({
    data: {
      id: 'admin-001',
      email: 'admin@soniartificialfashion.com',
      password_hash: '$2a$12$TVb7ROjbz2CJFo3K71MBGunOtW7G7NUJhIk0p6aWK4aVQJ0CaCYsO', // admin123
      name: 'Admin User',
      role: 'super_admin',
      email_verified: true,
      created_at: new Date(),
      updated_at: new Date()
    }
  });
  console.log('Created admin user:', adminUser.email);

  // Create jewelry categories
  const categories = [
    {
      id: 'cat-001',
      name_en: 'Jewelry',
      name_hi: 'आभूषण',
      description_en: 'Beautiful artificial jewelry crafted with precision and elegance',
      description_hi: 'परिशुद्धता और सौंदर्य के साथ निर्मित सुंदर कृत्रिम आभूषण',
      image: '/images/categories/jewelry.jpg',
      display_order: 1,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 'cat-002',
      name_en: 'Necklaces',
      name_hi: 'हार',
      description_en: 'Elegant necklaces for every occasion',
      description_hi: 'प्रत्येक अवसर के लिए सुरुचिपूर्ण हार',
      image: '/images/categories/necklaces.jpg',
      display_order: 2,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 'cat-003',
      name_en: 'Earrings',
      name_hi: 'कान के आभूषण',
      description_en: 'Stylish earrings to complement your look',
      description_hi: 'आपके स्वरूप को पूरा करने के लिए फैशनेबल कान के आभूषण',
      image: '/images/categories/earrings.jpg',
      display_order: 3,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 'cat-004',
      name_en: 'Bracelets',
      name_hi: 'कंघाइयाँ',
      description_en: 'Chic bracelets for a fashionable touch',
      description_hi: 'फैशनेबल स्पर्श के लिए चिक कंघाइयाँ',
      image: '/images/categories/bracelets.jpg',
      display_order: 4,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 'cat-005',
      name_en: 'Rings',
      name_hi: 'अंगूठियाँ',
      description_en: 'Beautiful rings to adorn your fingers',
      description_hi: 'आपकी अंगुलियों को सजाने के लिए सुंदर अंगूठियाँ',
      image: '/images/categories/rings.jpg',
      display_order: 5,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 'cat-006',
      name_en: 'Men Collection',
      name_hi: 'पुरुष संग्रह',
      description_en: 'Elegant jewelry collection designed exclusively for men',
      description_hi: 'पुरुषों के लिए विशेष रूप से डिज़ाइन किया गया सुरुचिपूर्ण आभूषण संग्रह',
      image: '/images/men collection/Gold_Figaro_Bracelet_Studio_Shot.png',
      display_order: 6,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 'cat-007',
      name_en: 'Women Collection',
      name_hi: 'महिला संग्रह',
      description_en: 'Exquisite jewelry collection crafted for the modern woman',
      description_hi: 'आधुनिक महिला के लिए तैयार किया गया शानदार आभूषण संग्रह',
      image: '/images/women collection/Golden_Radiance_Portrait.png',
      display_order: 7,
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

  // Create artisans
  const artisans = [
    {
      id: 'art-001',
      name: 'Soni Designer',
      bio_en: 'Master craftsman with 15 years of experience in jewelry making',
      bio_hi: '15 वर्षों के आभूषण बनाने के अनुभव वाले मास्टर कारीगर',
      specialization: 'Gold Plating, Stone Setting',
      location: 'Delhi, India',
      experience_years: 15,
      rating: 4.9,
      is_verified: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 'art-002',
      name: 'Priya Crafts',
      bio_en: 'Skilled artisan specializing in traditional jewelry designs',
      bio_hi: 'पारंपरिक आभूषण डिज़ाइन में विशेषज्ञ कारीगर',
      specialization: 'Traditional Designs, Beading',
      location: 'Mumbai, India',
      experience_years: 12,
      rating: 4.7,
      is_verified: true,
      created_at: new Date(),
      updated_at: new Date()
    }
  ];

  for (const artisanData of artisans) {
    const artisan = await prisma.artisan.create({
      data: artisanData
    });
    console.log('Created artisan:', artisan.name);
  }

  // Create jewelry products
  const jewelryProducts = [
    {
      id: 'prod-001',
      name: 'Gold Necklace Set',
      slug: 'gold-necklace-set',
      description_en: 'Elegant gold-plated necklace set with traditional design',
      description_hi: 'पारंपरिक डिज़ाइन के साथ सुरुचिपूर्ण सोने की प्लेटेड हार सेट',
      price: new Prisma.Decimal(2499),
      original_price: new Prisma.Decimal(3499),
      stock: 15,
      category_id: 'cat-002',
      artisan_id: 'art-001',
      image_path: '/images/products/Gold_Necklace_Set_Ecom_Soni_s778.png'
    },
    {
      id: 'prod-002',
      name: 'Royal Earrings',
      slug: 'royal-earrings',
      description_en: 'Stylish gold-plated earrings for special occasions',
      description_hi: 'विशेष अवसरों के लिए फैशनेबल सोने की प्लेटेड कान के आभूषण',
      price: new Prisma.Decimal(899),
      original_price: new Prisma.Decimal(1299),
      stock: 25,
      category_id: 'cat-003',
      artisan_id: 'art-001',
      image_path: '/images/products/Gold_Royal_Earrings_E455.png'
    },
    {
      id: 'prod-003',
      name: 'Geometric Bracelet',
      slug: 'geometric-bracelet',
      description_en: 'Modern geometric design gold-plated bracelet',
      description_hi: 'आधुनिक ज्यामितीय डिज़ाइन सोने की प्लेटेड कंघाई',
      price: new Prisma.Decimal(1299),
      original_price: new Prisma.Decimal(1799),
      stock: 20,
      category_id: 'cat-004',
      artisan_id: 'art-001',
      image_path: '/images/products/Gold_Bracelet_Geometric_Ecom_Soni.png'
    },
    {
      id: 'prod-004',
      name: 'Diamond Ring',
      slug: 'diamond-ring',
      description_en: 'Elegant diamond-studded gold ring',
      description_hi: 'सुरुचिपूर्ण हीरा जड़ित सोने की अंगूठी',
      price: new Prisma.Decimal(3499),
      original_price: new Prisma.Decimal(4999),
      stock: 10,
      category_id: 'cat-005',
      artisan_id: 'art-002',
      image_path: '/images/products/Men\'s_Gold_Diamond_Ring_r567.png'
    },
    {
      id: 'prod-005',
      name: 'Men\'s Gold Chain',
      slug: 'mens-gold-chain',
      description_en: 'Premium gold-plated chain for men',
      description_hi: 'पुरुषों के लिए प्रीमियम सोने की प्लेटेड चेन',
      price: new Prisma.Decimal(1899),
      original_price: new Prisma.Decimal(2499),
      stock: 12,
      category_id: 'cat-006',
      artisan_id: 'art-001',
      image_path: '/images/mens product/Soni_Gold_Chain_Watermark.png'
    },
    {
      id: 'prod-006',
      name: 'Women\'s Mangalsutra',
      slug: 'womens-mangalsutra',
      description_en: 'Traditional mangalsutra with modern touch',
      description_hi: 'आधुनिक स्पर्श के साथ पारंपरिक मांगलसूत्र',
      price: new Prisma.Decimal(2999),
      original_price: new Prisma.Decimal(3999),
      stock: 8,
      category_id: 'cat-007',
      artisan_id: 'art-002',
      image_path: '/images/products/Mangalsutra_Soni_Fashion_Ecommerce_a822.png'
    }
  ];

  console.log(`Creating ${jewelryProducts.length} jewelry products...`);

  for (const productData of jewelryProducts) {
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

  // Create banners
  const banners = [
    {
      id: 'banner-001',
      title_en: 'Gold Collection',
      title_hi: 'सोने का संग्रह',
      subtitle_en: 'Premium Gold Plated Jewelry',
      subtitle_hi: 'प्रीमियम सोने की प्लेटेड आभूषण',
      image_desktop: '/images/banner/banner1.png',
      image_mobile: '/images/banner/banner1.png',
      link_url: '/category/jewelry',
      display_order: 1,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 'banner-002',
      title_en: 'Earring Specials',
      title_hi: 'कान के आभूषण विशेष',
      subtitle_en: 'Statement Earrings',
      subtitle_hi: 'वक्तव्य कान के आभूषण',
      image_desktop: '/images/banner/banner2.png',
      image_mobile: '/images/banner/banner2.png',
      link_url: '/category/earrings',
      display_order: 2,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 'banner-003',
      title_en: 'Special Offers',
      title_hi: 'विशेष प्रस्ताव',
      subtitle_en: 'Limited Time Deals',
      subtitle_hi: 'सीमित समय के सौदे',
      image_desktop: '/images/banner/banner3.png',
      image_mobile: '/images/banner/banner3.png',
      link_url: '/products',
      display_order: 3,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    }
  ];

  for (const bannerData of banners) {
    const banner = await prisma.banner.create({
      data: bannerData
    });
    console.log('Created banner:', banner.title_en);
  }

  console.log('Seeding completed successfully with jewelry products!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });