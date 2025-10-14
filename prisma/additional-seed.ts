import { PrismaClient, users_role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Hash passwords for new users
  const userPassword = await bcrypt.hash('user123', 12);
  const adminPassword = await bcrypt.hash('admin123', 12);

  // Create additional sample users
  const sampleUsers = [
    {
      email: 'user1@lettex.com',
      name: 'Rajesh Kumar',
      password_hash: userPassword,
      role: users_role.customer,
      email_verified: true,
      phone: '+91 9876543211',
      is_active: true
    },
    {
      email: 'user2@lettex.com',
      name: 'Priya Sharma',
      password_hash: userPassword,
      role: users_role.customer,
      email_verified: true,
      phone: '+91 9876543212',
      is_active: true
    },
    {
      email: 'user3@lettex.com',
      name: 'Anita Desai',
      password_hash: userPassword,
      role: users_role.customer,
      email_verified: true,
      phone: '+91 9876543213',
      is_active: true
    },
    {
      email: 'user4@lettex.com',
      name: 'Vikram Singh',
      password_hash: userPassword,
      role: users_role.customer,
      email_verified: true,
      phone: '+91 9876543214',
      is_active: true
    },
    {
      email: 'user5@lettex.com',
      name: 'Sunita Patel',
      password_hash: userPassword,
      role: users_role.customer,
      email_verified: true,
      phone: '+91 9876543215',
      is_active: true
    },
    {
      email: 'user6@lettex.com',
      name: 'Deepak Verma',
      password_hash: userPassword,
      role: users_role.customer,
      email_verified: true,
      phone: '+91 9876543216',
      is_active: true
    },
    {
      email: 'user7@lettex.com',
      name: 'Meera Devi',
      password_hash: userPassword,
      role: users_role.customer,
      email_verified: true,
      phone: '+91 9876543217',
      is_active: true
    },
    {
      email: 'user8@lettex.com',
      name: 'Amitabh Joshi',
      password_hash: userPassword,
      role: users_role.customer,
      email_verified: true,
      phone: '+91 9876543218',
      is_active: true
    },
    {
      email: 'user9@lettex.com',
      name: 'Sangeeta Rao',
      password_hash: userPassword,
      role: users_role.customer,
      email_verified: true,
      phone: '+91 9876543219',
      is_active: true
    },
    {
      email: 'user10@lettex.com',
      name: 'Rahul Mehta',
      password_hash: userPassword,
      role: users_role.customer,
      email_verified: true,
      phone: '+91 9876543220',
      is_active: true
    }
  ];

  for (const userData of sampleUsers) {
    try {
      const user = await prisma.user.create({
        data: userData
      });
      console.log('Created user:', user.email);
    } catch (error) {
      console.log('User already exists or error:', userData.email);
    }
  }

  // Get categories and artisan for product creation
  const homeDecorCategory = await prisma.category.findFirst({ where: { slug: 'home-decor' } });
  const jewelryCategory = await prisma.category.findFirst({ where: { slug: 'jewelry' } });
  const clothingCategory = await prisma.category.findFirst({ where: { slug: 'clothing' } });
  const accessoriesCategory = await prisma.category.findFirst({ where: { slug: 'accessories' } });
  
  const artisan = await prisma.artisan.findFirst({
    where: { slug: 'ramesh-prajapati' }
  });

  // Create additional sample products
  const additionalProducts = [
    // Home Decor products
    {
      title: { en: 'Handwoven Basket', hi: 'हाथ से बुनी टोकरी' },
      slug: 'handwoven-basket',
      description: { en: 'Beautiful handwoven basket made from natural materials', hi: 'प्राकृतिक सामग्री से बनी सुंदर हाथ से बुनी टोकरी' },
      price: 799,
      stock: 20,
      sku: 'HWB001',
      categoryId: homeDecorCategory?.id || '',
      artisanId: artisan?.id || '',
      featured: true,
      bestSeller: false,
      newArrival: true,
      trending: true,
      isActive: true,
      rating: 4.6,
      reviewCount: 15,
      viewCount: 98,
      saleCount: 12
    },
    {
      title: { en: 'Tribal Wall Hanging', hi: 'जनजातीय दीवार का सजावट' },
      slug: 'tribal-wall-hanging',
      description: { en: 'Colorful tribal wall hanging with traditional patterns', hi: 'पारंपरिक पैटर्न वाली रंगीन जनजातीय दीवार का सजावट' },
      price: 1499,
      stock: 12,
      sku: 'TWH001',
      categoryId: homeDecorCategory?.id || '',
      artisanId: artisan?.id || '',
      featured: false,
      bestSeller: true,
      newArrival: false,
      trending: true,
      isActive: true,
      rating: 4.8,
      reviewCount: 22,
      viewCount: 156,
      saleCount: 18
    },
    {
      title: { en: 'Wooden Carving Set', hi: 'लकड़ी की नक्काशी सेट' },
      slug: 'wooden-carving-set',
      description: { en: 'Set of 3 wooden carvings with intricate designs', hi: 'जटिल डिजाइन वाली 3 लकड़ी की नक्काशी की सेट' },
      price: 2299,
      stock: 8,
      sku: 'WCS001',
      categoryId: homeDecorCategory?.id || '',
      artisanId: artisan?.id || '',
      featured: true,
      bestSeller: true,
      newArrival: false,
      trending: false,
      isActive: true,
      rating: 4.9,
      reviewCount: 18,
      viewCount: 203,
      saleCount: 15
    },
    {
      title: { en: 'Clay Pottery Set', hi: 'मिट्टी के बर्तनों का सेट' },
      slug: 'clay-pottery-set',
      description: { en: 'Set of 5 hand-painted clay pots', hi: '5 हाथ से पेंट किए गए मिट्टी के बर्तनों का सेट' },
      price: 1199,
      stock: 15,
      sku: 'CPS001',
      categoryId: homeDecorCategory?.id || '',
      artisanId: artisan?.id || '',
      featured: false,
      bestSeller: false,
      newArrival: true,
      trending: false,
      isActive: true,
      rating: 4.4,
      reviewCount: 9,
      viewCount: 76,
      saleCount: 6
    },
    {
      title: { en: 'Bamboo Lamp', hi: 'बांस का लैम्प' },
      slug: 'bamboo-lamp',
      description: { en: 'Handcrafted bamboo lamp with warm lighting', hi: 'गर्म प्रकाश वाला हाथ से बना बांस का लैम्प' },
      price: 1599,
      stock: 10,
      sku: 'BL001',
      categoryId: homeDecorCategory?.id || '',
      artisanId: artisan?.id || '',
      featured: true,
      bestSeller: false,
      newArrival: true,
      trending: true,
      isActive: true,
      rating: 4.7,
      reviewCount: 14,
      viewCount: 134,
      saleCount: 11
    },

    // Jewelry products
    {
      title: { en: 'Tribal Brass Earrings', hi: 'जनजातीय पीतल के कान के आभूषण' },
      slug: 'tribal-brass-earrings',
      description: { en: 'Pair of traditional brass earrings with tribal motifs', hi: 'जनजातीय प्रेरणा वाले पारंपरिक पीतल के कान के आभूषण की जोड़ी' },
      price: 599,
      stock: 25,
      sku: 'TBE001',
      categoryId: jewelryCategory?.id || '',
      artisanId: artisan?.id || '',
      featured: false,
      bestSeller: true,
      newArrival: false,
      trending: true,
      isActive: true,
      rating: 4.5,
      reviewCount: 20,
      viewCount: 167,
      saleCount: 17
    },
    {
      title: { en: 'Handcrafted Anklet', hi: 'हाथ से बना पांव का आभूषण' },
      slug: 'handcrafted-anklet',
      description: { en: 'Beautiful silver anklet with traditional design', hi: 'पारंपरिक डिजाइन वाला सुंदर चांदी का पांव का आभूषण' },
      price: 799,
      stock: 18,
      sku: 'HA001',
      categoryId: jewelryCategory?.id || '',
      artisanId: artisan?.id || '',
      featured: true,
      bestSeller: false,
      newArrival: true,
      trending: false,
      isActive: true,
      rating: 4.6,
      reviewCount: 12,
      viewCount: 89,
      saleCount: 9
    },
    {
      title: { en: 'Tribal Necklace Set', hi: 'जनजातीय हार का सेट' },
      slug: 'tribal-necklace-set',
      description: { en: 'Set of 3 necklaces with different tribal patterns', hi: 'अलग-अलग जनजातीय पैटर्न वाले 3 हारों का सेट' },
      price: 1299,
      stock: 12,
      sku: 'TNS001',
      categoryId: jewelryCategory?.id || '',
      artisanId: artisan?.id || '',
      featured: true,
      bestSeller: true,
      newArrival: false,
      trending: true,
      isActive: true,
      rating: 4.8,
      reviewCount: 25,
      viewCount: 198,
      saleCount: 22
    },

    // Clothing products
    {
      title: { en: 'Tribal Printed Shirt', hi: 'जनजातीय छपाई वाली शर्ट' },
      slug: 'tribal-printed-shirt',
      description: { en: 'Cotton shirt with traditional tribal prints', hi: 'पारंपरिक जनजातीय छपाई वाली सूती शर्ट' },
      price: 899,
      stock: 30,
      sku: 'TPS001',
      categoryId: clothingCategory?.id || '',
      artisanId: artisan?.id || '',
      featured: false,
      bestSeller: true,
      newArrival: true,
      trending: false,
      isActive: true,
      rating: 4.3,
      reviewCount: 16,
      viewCount: 145,
      saleCount: 13
    },
    {
      title: { en: 'Handwoven Scarf', hi: 'हाथ से बुना स्कार्फ' },
      slug: 'handwoven-scarf',
      description: { en: 'Colorful handwoven scarf made from natural fibers', hi: 'प्राकृतिक फाइबर से बना रंगीन हाथ से बुना स्कार्फ' },
      price: 699,
      stock: 22,
      sku: 'HWS001',
      categoryId: clothingCategory?.id || '',
      artisanId: artisan?.id || '',
      featured: true,
      bestSeller: false,
      newArrival: true,
      trending: true,
      isActive: true,
      rating: 4.5,
      reviewCount: 11,
      viewCount: 92,
      saleCount: 8
    },

    // Accessories products
    {
      title: { en: 'Tribal Cushion Cover', hi: 'जनजातीय कुशन कवर' },
      slug: 'tribal-cushion-cover',
      description: { en: 'Cotton cushion cover with tribal embroidery', hi: 'जनजातीय बुनाई वाला सूती कुशन कवर' },
      price: 499,
      stock: 28,
      sku: 'TCC001',
      categoryId: accessoriesCategory?.id || '',
      artisanId: artisan?.id || '',
      featured: false,
      bestSeller: true,
      newArrival: false,
      trending: true,
      isActive: true,
      rating: 4.4,
      reviewCount: 13,
      viewCount: 112,
      saleCount: 10
    },
    {
      title: { en: 'Wooden Keychain', hi: 'लकड़ी की चाबी की जंजीर' },
      slug: 'wooden-keychain',
      description: { en: 'Handcrafted wooden keychain with tribal design', hi: 'जनजातीय डिजाइन वाली हाथ से बनी लकड़ी की चाबी की जंजीर' },
      price: 199,
      stock: 50,
      sku: 'WK001',
      categoryId: accessoriesCategory?.id || '',
      artisanId: artisan?.id || '',
      featured: true,
      bestSeller: false,
      newArrival: true,
      trending: false,
      isActive: true,
      rating: 4.2,
      reviewCount: 8,
      viewCount: 67,
      saleCount: 5
    }
  ];

  for (const productData of additionalProducts) {
    try {
      // Check if product already exists
      const existingProduct = await prisma.product.findUnique({
        where: { slug: productData.slug }
      });

      if (!existingProduct) {
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
      } else {
        console.log('Product already exists:', productData.title);
      }
    } catch (error) {
      console.log('Error creating product:', error);
    }
  }

  console.log('Additional seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });