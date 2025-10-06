const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Create demo user
  const userPassword = '$2a$12$wHjp1RYkQHyPuME.lmF0XuVwD3b/pX47ROfL4sOhW5IHbIL3PKdqy'; // user123
  
  try {
    await prisma.user.create({
      data: {
        id: 'user-001',
        email: 'user@pachmarhi.com',
        password: userPassword,
        name: 'Demo User',
        role: 'USER',
        isActive: true,
        emailVerified: true
      }
    });
    console.log('Created demo user');
  } catch (error) {
    console.log('Demo user already exists');
  }

  // Create categories
  const categories = [
    {
      id: 'tribal-shirts',
      name: { en: 'Tribal Shirts', hi: 'जनजातीय शर्ट' },
      slug: 'tribal-shirts',
      description: { 
        en: 'Traditional tribal printed shirts and ethnic wear', 
        hi: 'पारंपरिक जनजातीय मुद्रित शर्ट और जातीय पहनावा' 
      },
      image: '/images/categories/cat-tribal-shirts.jpg',
      featured: true,
      isActive: true,
      productCount: 0,
      sortOrder: 1
    },
    {
      id: 'jewelry',
      name: { en: 'Jewelry', hi: 'आभूषण' },
      slug: 'jewelry',
      description: { 
        en: 'Handcrafted tribal jewelry and accessories', 
        hi: 'हस्तनिर्मित जनजातीय आभूषण और सहायक उपकरण' 
      },
      image: '/images/categories/cat-jewelry.jpg',
      featured: true,
      isActive: true,
      productCount: 0,
      sortOrder: 2
    },
    {
      id: 'handloom-textiles',
      name: { en: 'Handloom Textiles', hi: 'हैंडलूम वस्त्र' },
      slug: 'handloom-textiles',
      description: { 
        en: 'Traditional handwoven textiles and fabrics', 
        hi: 'पारंपरिक हस्तबुने वस्त्र और कपड़े' 
      },
      image: '/images/categories/cat-handloom-textiles.jpg',
      featured: true,
      isActive: true,
      productCount: 0,
      sortOrder: 3
    },
    {
      id: 'home-decor',
      name: { en: 'Home Decor', hi: 'घर की सजावट' },
      slug: 'home-decor',
      description: { 
        en: 'Beautiful home decor items and tribal art', 
        hi: 'सुंदर घर की सजावट की वस्तुएं और जनजातीय कला' 
      },
      image: '/images/categories/cat-home-decor.jpg',
      featured: true,
      isActive: true,
      productCount: 0,
      sortOrder: 4
    },
    {
      id: 'accessories',
      name: { en: 'Accessories', hi: 'सहायक उपकरण' },
      slug: 'accessories',
      description: { 
        en: 'Tribal accessories and decorative items', 
        hi: 'जनजातीय सहायक उपकरण और सजावटी वस्तुएं' 
      },
      image: '/images/categories/cat-accessories.jpg',
      featured: false,
      isActive: true,
      productCount: 0,
      sortOrder: 5
    },
    {
      id: 'gifts-souvenirs',
      name: { en: 'Gifts & Souvenirs', hi: 'उपहार और स्मृति चिन्ह' },
      slug: 'gifts-souvenirs',
      description: { 
        en: 'Perfect gifts and memorable souvenirs', 
        hi: 'पूर्ण उपहार और यादगार स्मृति चिन्ह' 
      },
      image: '/images/categories/cat-gifts-souvenirs.jpg',
      featured: false,
      isActive: true,
      productCount: 0,
      sortOrder: 6
    }
  ];

  for (const categoryData of categories) {
    try {
      await prisma.category.create({
        data: categoryData
      });
      console.log(`Created category: ${categoryData.name.en}`);
    } catch (error) {
      console.log(`Category already exists: ${categoryData.name.en}`);
    }
  }

  // Create artisans
  const artisans = [
    {
      id: 'sarla-bai',
      name: 'Sarla Bai',
      slug: 'sarla-bai',
      bio: { 
        en: 'Master weaver from Pachmarhi with 25 years of experience in traditional handloom techniques.', 
        hi: 'पचमढ़ी की मास्टर बुनकर जिनके पास पारंपरिक हैंडलूम तकनीकों में 25 साल का अनुभव है।' 
      },
      village: 'Pachmarhi',
      district: 'Hoshangabad',
      state: 'Madhya Pradesh',
      photo: '/images/artisans/arti-sarla.jpg',
      experience: 25,
      rating: 4.8,
      totalProducts: 15,
      isActive: true,
      joinedAt: new Date()
    },
    {
      id: 'ramesh-uikey',
      name: 'Ramesh Uikey',
      slug: 'ramesh-uikey',
      bio: { 
        en: 'Skilled pottery artisan specializing in terracotta crafts.', 
        hi: 'टेराकोटा शिल्प में विशेषज्ञता रखने वाले कुशल मिट्टी के बर्तन कारीगर।' 
      },
      village: 'Bori',
      district: 'Hoshangabad',
      state: 'Madhya Pradesh',
      photo: '/images/artisans/arti-ramesh.jpg',
      experience: 18,
      rating: 4.6,
      totalProducts: 12,
      isActive: true,
      joinedAt: new Date()
    },
    {
      id: 'meera-gond',
      name: 'Meera Gond',
      slug: 'meera-gond',
      bio: { 
        en: 'Renowned Gond painting artist preserving ancient tribal art forms.', 
        hi: 'प्राचीन जनजातीय कला रूपों को संरक्षित करने वाली प्रसिद्ध गोंड चित्रकारी कलाकार।' 
      },
      village: 'Satpura',
      district: 'Hoshangabad',
      state: 'Madhya Pradesh',
      photo: '/images/artisans/arti-meera.jpg',
      experience: 22,
      rating: 4.9,
      totalProducts: 20,
      isActive: true,
      joinedAt: new Date()
    }
  ];

  for (const artisanData of artisans) {
    try {
      await prisma.artisan.create({
        data: artisanData
      });
      console.log(`Created artisan: ${artisanData.name}`);
    } catch (error) {
      console.log(`Artisan already exists: ${artisanData.name}`);
    }
  }

  // Create products
  const products = [
    {
      id: 'bamboo-wall-art',
      title: { en: 'Bamboo Wall Art', hi: 'बांस की दीवार कला' },
      slug: 'bamboo-wall-art',
      description: { 
        en: 'Beautiful handcrafted bamboo wall art featuring traditional tribal motifs.', 
        hi: 'पारंपरिक जनजातीय रूपांकनों को दर्शाने वाली सुंदर हस्तनिर्मित बांस की दीवार कला।' 
      },
      shortDesc: { 
        en: 'Handcrafted bamboo wall art', 
        hi: 'हस्तनिर्मित बांस की दीवार कला' 
      },
      price: 1699.00,
      originalPrice: 1899.00,
      sku: 'BWA-001',
      stock: 12,
      tags: '["wall art", "bamboo", "eco-friendly", "tribal", "home decor"]',
      isActive: true,
      inStock: true,
      featured: true,
      bestSeller: true,
      newArrival: false,
      trending: false,
      rating: 4.5,
      reviewCount: 24,
      viewCount: 0,
      saleCount: 0,
      categoryId: 'home-decor',
      artisanId: 'ramesh-uikey'
    },
    {
      id: 'handloom-sari',
      title: { en: 'Handloom Sari', hi: 'हैंडलूम साड़ी' },
      slug: 'handloom-sari',
      description: { 
        en: 'Exquisite handwoven sari featuring traditional tribal patterns.', 
        hi: 'पारंपरिक जनजातीय पैटर्न को दर्शाने वाली उत्कृष्ट हस्तबुनी साड़ी।' 
      },
      shortDesc: { 
        en: 'Exquisite handwoven sari', 
        hi: 'उत्कृष्ट हस्तबुनी साड़ी' 
      },
      price: 2999.00,
      originalPrice: 3499.00,
      sku: 'HLS-001',
      stock: 8,
      tags: '["sari", "handloom", "cotton", "traditional", "ethnic wear"]',
      isActive: true,
      inStock: true,
      featured: true,
      bestSeller: true,
      newArrival: false,
      trending: false,
      rating: 4.8,
      reviewCount: 36,
      viewCount: 0,
      saleCount: 0,
      categoryId: 'handloom-textiles',
      artisanId: 'sarla-bai'
    },
    {
      id: 'tribal-silver-earrings',
      title: { en: 'Tribal Silver Earrings', hi: 'जनजातीय चांदी के कान के झूले' },
      slug: 'tribal-silver-earrings',
      description: { 
        en: 'Handcrafted silver earrings with traditional tribal designs.', 
        hi: 'पारंपरिक जनजातीय डिज़ाइनों के साथ हस्तनिर्मित चांदी के कान के झूले।' 
      },
      shortDesc: { 
        en: 'Handcrafted silver earrings', 
        hi: 'हस्तनिर्मित चांदी के कान के झूले' 
      },
      price: 899.00,
      originalPrice: 999.00,
      sku: 'TSE-001',
      stock: 25,
      tags: '["earrings", "silver", "tribal", "jewelry", "accessories"]',
      isActive: true,
      inStock: true,
      featured: true,
      bestSeller: false,
      newArrival: false,
      trending: true,
      rating: 4.6,
      reviewCount: 18,
      viewCount: 0,
      saleCount: 0,
      categoryId: 'jewelry',
      artisanId: 'ramesh-uikey'
    }
  ];

  for (const productData of products) {
    try {
      await prisma.product.create({
        data: {
          ...productData,
          productImages: {
            create: [
              {
                url: `/images/products/${productData.slug}/img1.jpg`,
                isPrimary: true,
                sortOrder: 0
              },
              {
                url: `/images/products/${productData.slug}/img2.jpg`,
                isPrimary: false,
                sortOrder: 1
              },
              {
                url: `/images/products/${productData.slug}/img3.jpg`,
                isPrimary: false,
                sortOrder: 2
              }
            ]
          }
        }
      });
      console.log(`Created product: ${productData.title.en}`);
    } catch (error) {
      console.log(`Product already exists: ${productData.title.en}`);
    }
  }

  console.log('Database seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });