import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create admin user - check if exists first
  let adminUser;
  try {
    adminUser = await prisma.user.create({
      data: {
        email: 'admin@pachmarhi.com',
        name: 'Admin User',
        password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeD2WBLBfp3cQ3T/a', // admin123
        role: 'SUPER_ADMIN',
        emailVerified: true,
        phone: '+91 9876543210',
        isActive: true
      }
    });
    console.log('Created admin user:', adminUser.email);
  } catch (error) {
    // User already exists, fetch it
    adminUser = await prisma.user.findUnique({
      where: { email: 'admin@pachmarhi.com' }
    });
    console.log('Admin user already exists:', adminUser?.email);
  }

  // Create sample categories - check if they exist first
  const categories = [
    {
      name: { en: 'Jewelry', hi: 'आभूषण' },
      slug: 'jewelry',
      description: { en: 'Traditional tribal jewelry', hi: 'पारंपरिक जनजातीय आभूषण' },
      featured: true,
      isActive: true,
      productCount: 0,
      sortOrder: 1
    },
    {
      name: { en: 'Home Decor', hi: 'घर की सजावट' },
      slug: 'home-decor',
      description: { en: 'Beautiful home decoration items', hi: 'सुंदर घर की सजावट की वस्तुएं' },
      featured: true,
      isActive: true,
      productCount: 0,
      sortOrder: 2
    },
    {
      name: { en: 'Clothing', hi: 'कपड़े' },
      slug: 'clothing',
      description: { en: 'Traditional tribal clothing', hi: 'पारंपरिक जनजातीय कपड़े' },
      featured: false,
      isActive: true,
      productCount: 0,
      sortOrder: 3
    },
    {
      name: { en: 'Accessories', hi: 'सामान' },
      slug: 'accessories',
      description: { en: 'Handmade accessories', hi: 'हाथ से बने सामान' },
      featured: false,
      isActive: true,
      productCount: 0,
      sortOrder: 4
    }
  ];

  for (const categoryData of categories) {
    try {
      const category = await prisma.category.create({
        data: categoryData
      });
      console.log('Created category:', category.name);
    } catch (error) {
      console.log('Category already exists:', categoryData.name);
    }
  }

  // Create sample artisan - check if exists first
  let artisan;
  try {
    artisan = await prisma.artisan.create({
      data: {
        name: 'Ramesh Prajapati',
        slug: 'ramesh-prajapati',
        bio: { en: 'Master craftsman with 20 years of experience', hi: '20 साल के अनुभव वाले कुशल कारीगर' },
        village: 'Pachmarhi',
        district: 'Hoshangabad',
        state: 'Madhya Pradesh',
        experience: 20,
        rating: 4.8,
        totalProducts: 0,
        isActive: true,
        joinedAt: new Date()
      }
    });
    console.log('Created artisan:', artisan.name);
  } catch (error) {
    // Artisan already exists, fetch it
    artisan = await prisma.artisan.findUnique({
      where: { slug: 'ramesh-prajapati' }
    });
    console.log('Artisan already exists:', artisan?.name);
  }

  // Check if products already exist
  const existingProducts = await prisma.product.findMany({
    where: {
      slug: {
        in: ['bamboo-wall-art', 'tribal-silver-necklace']
      }
    }
  });

  if (existingProducts.length === 0) {
    // Create sample products
    const products = [
      {
        title: { en: 'Bamboo Wall Art', hi: 'बांस की दीवार कला' },
        slug: 'bamboo-wall-art',
        description: { en: 'Beautiful handcrafted bamboo wall art', hi: 'सुंदर हाथ से बना बांस की दीवार कला' },
        price: 1299,
        stock: 15,
        sku: 'BWA001',
        categoryId: (await prisma.category.findFirst({ where: { slug: 'home-decor' } }))?.id || '',
        artisanId: artisan?.id || '',
        featured: true,
        bestSeller: true,
        newArrival: true,
        trending: false,
        isActive: true,
        rating: 4.5,
        reviewCount: 12,
        viewCount: 124,
        saleCount: 8
      },
      {
        title: { en: 'Tribal Silver Necklace', hi: 'जनजातीय चांदी की माला' },
        slug: 'tribal-silver-necklace',
        description: { en: 'Handcrafted silver tribal necklace', hi: 'हाथ से बनी चांदी की जनजातीय माला' },
        price: 899,
        stock: 8,
        sku: 'TSN001',
        categoryId: (await prisma.category.findFirst({ where: { slug: 'jewelry' } }))?.id || '',
        artisanId: artisan?.id || '',
        featured: true,
        bestSeller: false,
        newArrival: true,
        trending: true,
        isActive: true,
        rating: 4.7,
        reviewCount: 8,
        viewCount: 89,
        saleCount: 5
      }
    ];

    for (const productData of products) {
      const product = await prisma.product.create({
        data: {
          ...productData,
          productImages: {
            create: [
              {
                url: '/images/products/placeholder.jpg',
                isPrimary: true,
                sortOrder: 0
              }
            ]
          }
        }
      });
      console.log('Created product:', product.title);
    }
  } else {
    console.log('Products already exist, skipping creation');
  }

  // Create sample shipping options
  const shippingOptions = [
    {
      name: { en: 'Standard Delivery', hi: 'मानक डिलीवरी' },
      description: { en: 'Delivery within 5-7 business days', hi: '5-7 व्यावसायिक दिनों के भीतर डिलीवरी' },
      cost: 50,
      minOrderValue: 500,
      estimatedDays: 5,
      isActive: true,
      sortOrder: 1
    },
    {
      name: { en: 'Express Delivery', hi: 'एक्सप्रेस डिलीवरी' },
      description: { en: 'Delivery within 2-3 business days', hi: '2-3 व्यावसायिक दिनों के भीतर डिलीवरी' },
      cost: 100,
      minOrderValue: null,
      estimatedDays: 2,
      isActive: true,
      sortOrder: 2
    },
    {
      name: { en: 'Same Day Delivery', hi: 'समान दिन डिलीवरी' },
      description: { en: 'Delivery within 24 hours', hi: '24 घंटों के भीतर डिलीवरी' },
      cost: 150,
      minOrderValue: null,
      estimatedDays: 1,
      isActive: true,
      sortOrder: 3
    }
  ];

  for (const optionData of shippingOptions) {
    try {
      // Check if shipping option already exists by name.en
      const existingOptions = await prisma.shippingOption.findMany({
        where: {
          name: {
            path: ['en'],
            equals: optionData.name.en
          }
        }
      });
      
      if (existingOptions.length === 0) {
        const option = await prisma.shippingOption.create({
          data: optionData
        });
        console.log('Created shipping option:', option.name);
      } else {
        console.log('Shipping option already exists:', optionData.name);
      }
    } catch (error) {
      console.log('Error creating shipping option:', error);
    }
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });