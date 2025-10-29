import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Adding more fashion accessories products...');

  // Additional Fashion Accessories products from mens product folder
  const additionalFashionAccessoriesProducts = [
    {
      id: 'prod-017',
      name: 'Bracelets with Watermark Logo',
      slug: 'bracelets-watermark-logo',
      description_en: 'Stylish bracelets with watermark logo and tagline',
      description_hi: 'वॉटरमार्क लोगो और टैगलाइन के साथ स्टाइलिश ब्रेसलेट्स',
      price: new Prisma.Decimal(1699),
      original_price: new Prisma.Decimal(2299),
      stock: 15,
      category_id: 'cat-001', // Fashion Accessories category (Jewelry)
      artisan_id: 'art-001',
      image_path: '/images/mens product/Bracelets_Watermark_Logo_Tagline.png'
    },
    {
      id: 'prod-018',
      name: 'Logo Tagline Gold Pendant',
      slug: 'logo-tagline-gold-pendant',
      description_en: 'Elegant gold pendant with logo and tagline watermark',
      description_hi: 'लोगो और टैगलाइन वॉटरमार्क के साथ सुरुचिपूर्ण सोने का पेंडेंट',
      price: new Prisma.Decimal(1999),
      original_price: new Prisma.Decimal(2799),
      stock: 12,
      category_id: 'cat-001', // Fashion Accessories category (Jewelry)
      artisan_id: 'art-002',
      image_path: '/images/mens product/Logo_Tagline_Gold_Pendant_Watermark.png'
    },
    {
      id: 'prod-019',
      name: 'Soni Jewelry Logo Watermark',
      slug: 'soni-jewelry-logo-watermark',
      description_en: 'Premium jewelry with Soni logo watermark',
      description_hi: 'सोनी लोगो वॉटरमार्क के साथ प्रीमियम आभूषण',
      price: new Prisma.Decimal(2299),
      original_price: new Prisma.Decimal(3199),
      stock: 10,
      category_id: 'cat-001', // Fashion Accessories category (Jewelry)
      artisan_id: 'art-001',
      image_path: '/images/mens product/Soni_Jewelry_Logo_Watermark.png'
    }
  ];

  console.log(`Creating ${additionalFashionAccessoriesProducts.length} additional fashion accessories products...`);

  for (const productData of additionalFashionAccessoriesProducts) {
    try {
      // Check if product already exists
      const existingProduct = await prisma.product.findUnique({
        where: { id: productData.id }
      });

      if (existingProduct) {
        console.log(`Product ${productData.name} already exists, updating...`);
        // Update existing product
        const product = await prisma.product.update({
          where: { id: productData.id },
          data: {
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
            updated_at: new Date()
          }
        });
        console.log(`Updated product: ${product.title_en} (${product.id})`);
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

  console.log('Additional fashion accessories products added successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });