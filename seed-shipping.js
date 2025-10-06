const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedMarketingData() {
  console.log('Seeding marketing data...');
  
  // Seed shipping options
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
      const option = await prisma.shippingOption.create({
        data: optionData
      });
      console.log('Created shipping option:', option.name);
    } catch (error) {
      console.log('Error creating shipping option:', error.message);
    }
  }

  // Seed coupons
  const coupons = [
    {
      code: 'WELCOME10',
      title: 'Welcome Discount',
      description: '10% off on your first order',
      type: 'PERCENTAGE',
      value: 10,
      minOrderValue: 200,
      maxDiscount: 100,
      usageLimit: 1000,
      userLimit: 1,
      isActive: true,
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 3)) // 3 months from now
    },
    {
      code: 'FREESHIP',
      title: 'Free Shipping',
      description: 'Free shipping on orders over ₹500',
      type: 'FREE_SHIPPING',
      value: 0,
      minOrderValue: 500,
      usageLimit: 500,
      userLimit: 2,
      isActive: true,
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)) // 1 month from now
    },
    {
      code: 'SAVE50',
      title: 'Flat ₹50 Off',
      description: 'Flat ₹50 discount on orders over ₹300',
      type: 'FIXED',
      value: 50,
      minOrderValue: 300,
      usageLimit: 200,
      userLimit: 1,
      isActive: true,
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 15)) // 15 days from now
    }
  ];

  for (const couponData of coupons) {
    try {
      const coupon = await prisma.coupon.create({
        data: couponData
      });
      console.log('Created coupon:', coupon.title);
    } catch (error) {
      console.log('Error creating coupon:', error.message);
    }
  }

  console.log('Marketing data seeding completed!');
  await prisma.$disconnect();
}

seedMarketingData().catch((e) => {
  console.error(e);
  process.exit(1);
});