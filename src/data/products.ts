import { Product } from './types';

export const products: Product[] = [
  {
    id: 'bamboo-wall-art-001',
    slug: 'bamboo-wall-art',
    title: {
      en: 'Bamboo Wall Art',
      hi: 'बांस की दीवार कला'
    },
    description: {
      en: 'Handcrafted by skilled artisans, this bamboo wall art reflects centuries of tradition and artistry. Perfect for gifting or decorating your home with authentic charm.',
      hi: 'कुशल कारीगरों द्वारा हस्तनिर्मित, यह बांस की दीवार कला शताब्दियों की परंपरा और कला को दर्शाता है। उपहार देने या अपने घर को प्रमाणिक आकर्षण के साथ सजाने के लिए उपयुक्त।'
    },
    price: 2499,
    originalPrice: 3499,
    discount: 29,
    stock: 15,
    rating: 4.5,
    reviewCount: 23,
    categoryId: 'home-decor',
    artisanId: 'sarla-bai',
    images: [
      '/images/products/bamboo-wall-art/img1.jpg',
      '/images/products/bamboo-wall-art/img2.jpg',
      '/images/products/bamboo-wall-art/img3.jpg',
      '/images/products/bamboo-wall-art/img4.jpg'
    ],
    material: 'Natural Bamboo',
    dimensions: '24" x 18" x 2"',
    tags: ['eco-friendly', 'wall-art', 'bamboo', 'gond-art'],
    featured: true,
    bestSeller: false,
    trending: true,
    newArrival: false,
    createdAt: '2024-01-15'
  },
  {
    id: 'handloom-sari-001',
    slug: 'handloom-sari',
    title: {
      en: 'Handloom Sari',
      hi: 'हैंडलूम साड़ी'
    },
    description: {
      en: 'Exquisite handloom sari woven with traditional patterns and vibrant colors. Made by skilled tribal artisans, this sari represents the rich textile heritage of Madhya Pradesh. Perfect for special occasions and cultural celebrations.',
      hi: 'पारंपरिक पैटर्न और जीवंत रंगों के साथ बुनी गई उत्कृष्ट हैंडलूम साड़ी। कुशल जनजातीय कारीगरों द्वारा निर्मित, यह साड़ी मध्य प्रदेश की समृद्ध वस्त्र विरासत का प्रतिनिधित्व करती है।'
    },
    price: 4999,
    originalPrice: 6999,
    discount: 29,
    stock: 8,
    rating: 4.8,
    reviewCount: 45,
    categoryId: 'handloom-textiles',
    artisanId: 'meera-gond',
    images: [
      '/images/products/handloom-sari/img1.jpg',
      '/images/products/handloom-sari/img2.jpg',
      '/images/products/handloom-sari/img3.jpg',
      '/images/products/handloom-sari/img4.jpg',
      '/images/products/handloom-sari/img5.jpg'
    ],
    variants: {
      color: ['Red', 'Blue', 'Green', 'Yellow']
    },
    material: 'Pure Cotton',
    dimensions: '6.3 meters length',
    tags: ['handloom', 'sari', 'cotton', 'traditional'],
    featured: true,
    bestSeller: true,
    trending: false,
    newArrival: false,
    createdAt: '2024-01-10'
  },
  {
    id: 'terracotta-necklace-001',
    slug: 'terracotta-necklace',
    title: {
      en: 'Terracotta Necklace',
      hi: 'टेराकोटा हार'
    },
    description: {
      en: 'Elegant terracotta necklace handcrafted with intricate designs. This piece combines earthy textures with artistic patterns, making it perfect for both casual and formal occasions. Each bead is individually shaped and painted.',
      hi: 'जटिल डिजाइनों के साथ हस्तनिर्मित सुरुचिपूर्ण टेराकोटा हार। यह टुकड़ा मिट्टी की बनावट को कलात्मक पैटर्न के साथ जोड़ता है, जो इसे आकस्मिक और औपचारिक दोनों अवसरों के लिए आदर्श बनाता है।'
    },
    price: 899,
    originalPrice: 1299,
    discount: 31,
    stock: 25,
    rating: 4.3,
    reviewCount: 18,
    categoryId: 'jewelry',
    artisanId: 'ramesh-uikey',
    images: [
      '/images/products/terracotta-necklace/img1.jpg',
      '/images/products/terracotta-necklace/img2.jpg',
      '/images/products/terracotta-necklace/img3.jpg'
    ],
    variants: {
      color: ['Natural', 'Brown', 'Red']
    },
    material: 'Terracotta Clay',
    dimensions: '16" length',
    tags: ['jewelry', 'terracotta', 'handmade', 'necklace'],
    featured: false,
    bestSeller: true,
    trending: true,
    newArrival: false,
    createdAt: '2024-01-20'
  },
  {
    id: 'dokra-figurine-001',
    slug: 'dokra-figurine',
    title: {
      en: 'Dokra Figurine',
      hi: 'डोकरा मूर्ति'
    },
    description: {
      en: 'Traditional Dokra metal figurine crafted using the ancient lost-wax technique. This unique art form has been practiced for over 4000 years. The figurine depicts tribal life and customs, making it a perfect decorative piece.',
      hi: 'प्राचीन लॉस्ट-वैक्स तकनीक का उपयोग करके तैयार की गई पारंपरिक डोकरा धातु मूर्ति। यह अनूठी कला रूप 4000 से अधिक वर्षों से प्रचलित है। मूर्ति जनजातीय जीवन और रीति-रिवाजों को दर्शाती है।'
    },
    price: 1899,
    originalPrice: 2499,
    discount: 24,
    stock: 12,
    rating: 4.6,
    reviewCount: 31,
    categoryId: 'home-decor',
    artisanId: 'ramesh-uikey',
    images: [
      '/images/products/dokra-figurine/img1.jpg',
      '/images/products/dokra-figurine/img2.jpg',
      '/images/products/dokra-figurine/img3.jpg',
      '/images/products/dokra-figurine/img4.jpg'
    ],
    material: 'Brass and Bronze Alloy',
    dimensions: '8" x 4" x 3"',
    tags: ['dokra', 'figurine', 'metal-craft', 'traditional'],
    featured: false,
    bestSeller: false,
    trending: true,
    newArrival: true,
    createdAt: '2024-02-01'
  },
  {
    id: 'tribal-printed-shirt-001',
    slug: 'tribal-printed-shirt',
    title: {
      en: 'Tribal Printed Shirt',
      hi: 'जनजातीय प्रिंटेड शर्ट'
    },
    description: {
      en: 'Comfortable cotton shirt featuring authentic tribal prints inspired by Gond art. Perfect for casual wear, this shirt brings cultural aesthetics to modern fashion. Each print tells a story of tribal heritage and natural motifs.',
      hi: 'गोंड कला से प्रेरित प्रामाणिक जनजातीय प्रिंट की विशेषता वाली आरामदायक सूती शर्ट। आकस्मिक पहनने के लिए आदर्श, यह शर्ट आधुनिक फैशन में सांस्कृतिक सौंदर्यशास्त्र लाती है।'
    },
    price: 1299,
    originalPrice: 1799,
    discount: 28,
    stock: 20,
    rating: 4.4,
    reviewCount: 27,
    categoryId: 'tribal-shirts',
    artisanId: 'sarla-bai',
    images: [
      '/images/products/tribal-printed-shirt/img1.jpg',
      '/images/products/tribal-printed-shirt/img2.jpg',
      '/images/products/tribal-printed-shirt/img3.jpg'
    ],
    variants: {
      size: ['S', 'M', 'L', 'XL', 'XXL'],
      color: ['White', 'Cream', 'Light Blue']
    },
    material: '100% Cotton',
    dimensions: 'Various sizes available',
    tags: ['shirt', 'tribal-print', 'cotton', 'casual-wear'],
    featured: true,
    bestSeller: true,
    trending: false,
    newArrival: false,
    createdAt: '2024-01-25'
  },
  {
    id: 'cane-basket-001',
    slug: 'cane-basket',
    title: {
      en: 'Cane Basket',
      hi: 'बेंत की टोकरी'
    },
    description: {
      en: 'Eco-friendly cane basket woven using traditional techniques. Perfect for storage and home organization, this basket combines functionality with artistic beauty. Made from sustainable cane material.',
      hi: 'पारंपरिक तकनीकों का उपयोग करके बुनी गई पर्यावरण-अनुकूल बेंत की टोकरी। भंडारण और घर के संगठन के लिए आदर्श, यह टोकरी कार्यक्षमता को कलात्मक सुंदरता के साथ जोड़ती है।'
    },
    price: 799,
    originalPrice: 1099,
    discount: 27,
    stock: 30,
    rating: 4.2,
    reviewCount: 15,
    categoryId: 'accessories',
    artisanId: 'meera-gond',
    images: [
      '/images/products/cane-basket/img1.jpg',
      '/images/products/cane-basket/img2.jpg',
      '/images/products/cane-basket/img3.jpg',
      '/images/products/cane-basket/img4.jpg'
    ],
    variants: {
      size: ['Small', 'Medium', 'Large']
    },
    material: 'Natural Cane',
    dimensions: 'Various sizes: 8", 10", 12" diameter',
    tags: ['basket', 'cane', 'storage', 'eco-friendly'],
    featured: false,
    bestSeller: false,
    trending: false,
    newArrival: true,
    createdAt: '2024-02-05'
  }
];