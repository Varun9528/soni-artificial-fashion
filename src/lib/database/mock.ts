// Mock database implementation for development
import { User, Address } from '@/data/types';
import * as bcrypt from 'bcryptjs';

// Import CartItem interface from types
import { CartItem } from '@/data/types';

interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
}

// Hash passwords for mock users
const adminPasswordHash = bcrypt.hashSync('admin123', 12);
const userPasswordHash = bcrypt.hashSync('user123', 12);

// Mock users data
const mockUsers: any[] = [
  {
    id: '1',
    email: 'admin@soniartificialfashion.com',
    password_hash: adminPasswordHash,
    name: 'Admin User',
    role: 'super_admin',
    email_verified: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    email: 'user@lettex.com',
    password_hash: userPasswordHash,
    name: 'Demo User',
    role: 'customer',
    email_verified: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

// Mock products data
const mockProducts: any[] = [
  // Men's Collection Products - Using images from "mens product" directory
  {
    id: 'prod-001',
    slug: 'mens-gold-chain',
    title: {
      en: 'Men\'s Gold Chain',
      hi: 'पुरुषों की सोने की चेन'
    },
    description: {
      en: 'Premium gold-plated chain for men',
      hi: 'पुरुषों के लिए प्रीमियम सोने की प्लेटेड चेन'
    },
    price: 1899,
    originalPrice: 2499,
    stock: 12,
    rating: 4.2,
    reviewCount: 15,
    categoryId: 'cat-006', // Men Collection
    artisanId: 'soni-designer',
    featured: false,
    bestSeller: true,
    newArrival: false,
    trending: false,
    isActive: true,
    createdAt: '2024-01-01',
    images: ['/images/products/Soni_Gold_Chain_Watermark.png']
  },
  {
    id: 'prod-002',
    slug: 'mens-gold-bracelet',
    title: {
      en: 'Men\'s Gold Bracelet',
      hi: 'पुरुषों की सोने की कंघाई'
    },
    description: {
      en: 'Stylish gold-plated bracelet for men',
      hi: 'पुरुषों के लिए स्टाइलिश सोने की प्लेटेड कंघाई'
    },
    price: 2199,
    originalPrice: 2999,
    stock: 15,
    rating: 4.6,
    reviewCount: 7,
    categoryId: 'cat-006', // Men Collection
    artisanId: 'soni-designer',
    featured: true,
    bestSeller: false,
    newArrival: true,
    trending: true,
    isActive: true,
    createdAt: '2024-01-02',
    images: ['/images/products/Gold_Bracelet_Marble_Macro_Luxury (2).png']
  },
  {
    id: 'prod-003',
    slug: 'mens-gold-cufflinks',
    title: {
      en: 'Men\'s Gold Cufflinks',
      hi: 'पुरुषों के सोने के कफलिंक्स'
    },
    description: {
      en: 'Elegant gold-plated cufflinks for formal occasions',
      hi: 'औपचारिक अवसरों के लिए सुरुचिपूर्ण सोने की प्लेटेड कफलिंक्स'
    },
    price: 1599,
    originalPrice: 2199,
    stock: 20,
    rating: 4.4,
    reviewCount: 9,
    categoryId: 'cat-006', // Men Collection
    artisanId: 'priya-crafts',
    featured: false,
    bestSeller: true,
    newArrival: false,
    trending: false,
    isActive: true,
    createdAt: '2024-01-03',
    images: ['/images/products/Gold_Cufflinks_Marble_Macro_Luxury.png']
  },
  {
    id: 'prod-004',
    slug: 'mens-gold-ring',
    title: {
      en: 'Men\'s Gold Ring',
      hi: 'पुरुषों की सोने की अंगूठी'
    },
    description: {
      en: 'Traditional gold ring for men',
      hi: 'पुरुषों के लिए पारंपरिक सोने की अंगूठी'
    },
    price: 2999,
    originalPrice: 3999,
    stock: 10,
    rating: 4.7,
    reviewCount: 12,
    categoryId: 'cat-006', // Men Collection
    artisanId: 'soni-designer',
    featured: true,
    bestSeller: false,
    newArrival: true,
    trending: false,
    isActive: true,
    createdAt: '2024-01-04',
    images: ['/images/products/Gold_Rings_Marble_Luxury_Macro (1).png']
  },
  {
    id: 'prod-005',
    slug: 'mens-gold-watch',
    title: {
      en: 'Men\'s Gold Watch',
      hi: 'पुरुषों की सोने की घड़ी'
    },
    description: {
      en: 'Luxury gold watch for men',
      hi: 'पुरुषों के लिए लक्ज़री सोने की घड़ी'
    },
    price: 4499,
    originalPrice: 5999,
    stock: 8,
    rating: 4.8,
    reviewCount: 6,
    categoryId: 'cat-006', // Men Collection
    artisanId: 'priya-crafts',
    featured: true,
    bestSeller: true,
    newArrival: true,
    trending: true,
    isActive: true,
    createdAt: '2024-01-05',
    images: ['/images/products/Luxury_Gold_Watch_Marble_Macro.png']
  },
  {
    id: 'prod-006',
    slug: 'mens-gold-money-clip',
    title: {
      en: 'Men\'s Gold Money Clip',
      hi: 'पुरुषों का सोने का मनी क्लिप'
    },
    description: {
      en: 'Elegant gold money clip for men',
      hi: 'पुरुषों के लिए सुरुचिपूर्ण सोने का मनी क्लिप'
    },
    price: 1299,
    originalPrice: 1799,
    stock: 18,
    rating: 4.3,
    reviewCount: 8,
    categoryId: 'cat-006', // Men Collection
    artisanId: 'soni-designer',
    featured: false,
    bestSeller: false,
    newArrival: true,
    trending: false,
    isActive: true,
    createdAt: '2024-01-06',
    images: ['/images/products/Gold_Money_Clip_Luxury_Macro.png']
  },
  {
    id: 'prod-007',
    slug: 'mens-gold-pendant',
    title: {
      en: 'Men\'s Gold Pendant',
      hi: 'पुरुषों का सोने का पेंडेंट'
    },
    description: {
      en: 'Stylish gold pendant for men',
      hi: 'पुरुषों के लिए स्टाइलिश सोने का पेंडेंट'
    },
    price: 2499,
    originalPrice: 3499,
    stock: 14,
    rating: 4.5,
    reviewCount: 11,
    categoryId: 'cat-006', // Men Collection
    artisanId: 'priya-crafts',
    featured: true,
    bestSeller: false,
    newArrival: false,
    trending: true,
    isActive: true,
    createdAt: '2024-01-07',
    images: ['/images/products/Gold_Pendant_Marble_Luxury_Macro.png']
  },
  {
    id: 'prod-008',
    slug: 'mens-gold-signet-ring',
    title: {
      en: 'Men\'s Gold Signet Ring',
      hi: 'पुरुषों की सोने की सिग्नेट अंगूठी'
    },
    description: {
      en: 'Classic gold signet ring for men',
      hi: 'पुरुषों के लिए क्लासिक सोने की सिग्नेट अंगूठी'
    },
    price: 3499,
    originalPrice: 4499,
    stock: 9,
    rating: 4.6,
    reviewCount: 7,
    categoryId: 'cat-006', // Men Collection
    artisanId: 'soni-designer',
    featured: false,
    bestSeller: true,
    newArrival: false,
    trending: false,
    isActive: true,
    createdAt: '2024-01-08',
    images: ['/images/products/Gold_Signet_Ring_Marble_Macro.png']
  },
  {
    id: 'prod-009',
    slug: 'mens-gold-tie-clip',
    title: {
      en: 'Men\'s Gold Tie Clip',
      hi: 'पुरुषों का सोने का टाई क्लिप'
    },
    description: {
      en: 'Elegant gold tie clip for men',
      hi: 'पुरुषों के लिए सुरुचिपूर्ण सोने का टाई क्लिप'
    },
    price: 1799,
    originalPrice: 2499,
    stock: 16,
    rating: 4.1,
    reviewCount: 9,
    categoryId: 'cat-006', // Men Collection
    artisanId: 'priya-crafts',
    featured: false,
    bestSeller: false,
    newArrival: true,
    trending: false,
    isActive: true,
    createdAt: '2024-01-09',
    images: ['/images/products/Gold_Tie_Clip_Marble_Luxury.png']
  },
  {
    id: 'prod-010',
    slug: 'mens-gold-pin',
    title: {
      en: 'Men\'s Gold Pin',
      hi: 'पुरुषों का सोने का पिन'
    },
    description: {
      en: 'Luxury gold pin for men',
      hi: 'पुरुषों के लिए लक्ज़री सोने का पिन'
    },
    price: 2299,
    originalPrice: 3199,
    stock: 11,
    rating: 4.4,
    reviewCount: 6,
    categoryId: 'cat-006', // Men Collection
    artisanId: 'soni-designer',
    featured: true,
    bestSeller: false,
    newArrival: true,
    trending: false,
    isActive: true,
    createdAt: '2024-01-10',
    images: ['/images/products/Opulent_Gold_Pin_Marble_Macro.png']
  },
  // Women's Collection Products - Using images from "products" directory
  {
    id: 'prod-011',
    slug: 'gold-necklace-set',
    title: {
      en: 'Gold Necklace Set',
      hi: 'सोने का हार सेट'
    },
    description: {
      en: 'Elegant gold-plated necklace set with traditional design',
      hi: 'पारंपरिक डिज़ाइन के साथ सुरुचिपूर्ण सोने की प्लेटेड हार सेट'
    },
    price: 2499,
    originalPrice: 3499,
    stock: 15,
    rating: 4.5,
    reviewCount: 12,
    categoryId: 'cat-007', // Women Collection
    artisanId: 'soni-designer',
    featured: true,
    bestSeller: false,
    newArrival: true,
    trending: false,
    isActive: true,
    createdAt: '2024-01-11',
    images: ['/images/products/Gold_Necklace_Set_Ecom_Soni_s778.png']
  },
  {
    id: 'prod-012',
    slug: 'royal-earrings',
    title: {
      en: 'Royal Earrings',
      hi: 'रॉयल कान के आभूषण'
    },
    description: {
      en: 'Stylish gold-plated earrings for special occasions',
      hi: 'विशेष अवसरों के लिए फैशनेबल सोने की प्लेटेड कान के आभूषण'
    },
    price: 899,
    originalPrice: 1299,
    stock: 25,
    rating: 4.2,
    reviewCount: 8,
    categoryId: 'cat-007', // Women Collection
    artisanId: 'soni-designer',
    featured: true,
    bestSeller: true,
    newArrival: false,
    trending: true,
    isActive: true,
    createdAt: '2024-01-12',
    images: ['/images/products/Gold_Royal_Earrings_E455.png']
  },
  {
    id: 'prod-013',
    slug: 'geometric-bracelet',
    title: {
      en: 'Geometric Bracelet',
      hi: 'ज्यामितीय कंघाई'
    },
    description: {
      en: 'Modern geometric design gold-plated bracelet',
      hi: 'आधुनिक ज्यामितीय डिज़ाइन सोने की प्लेटेड कंघाई'
    },
    price: 1299,
    originalPrice: 1799,
    stock: 20,
    rating: 4.7,
    reviewCount: 15,
    categoryId: 'cat-007', // Women Collection
    artisanId: 'soni-designer',
    featured: false,
    bestSeller: true,
    newArrival: false,
    trending: false,
    isActive: true,
    createdAt: '2024-01-13',
    images: ['/images/products/Gold_Bracelet_Geometric_Ecom_Soni.png']
  },
  {
    id: 'prod-014',
    slug: 'diamond-ring',
    title: {
      en: 'Diamond Ring',
      hi: 'हीरा अंगूठी'
    },
    description: {
      en: 'Elegant diamond-studded gold ring',
      hi: 'सुरुचिपूर्ण हीरा जड़ित सोने की अंगूठी'
    },
    price: 3499,
    originalPrice: 4999,
    stock: 10,
    rating: 4.9,
    reviewCount: 7,
    categoryId: 'cat-007', // Women Collection
    artisanId: 'priya-crafts',
    featured: true,
    bestSeller: false,
    newArrival: true,
    trending: true,
    isActive: true,
    createdAt: '2024-01-14',
    images: ['/images/products/Men\'s_Gold_Diamond_Ring_r567.png']
  },
  {
    id: 'prod-015',
    slug: 'womens-mangalsutra',
    title: {
      en: 'Women\'s Mangalsutra',
      hi: 'महिलाओं का मांगलसूत्र'
    },
    description: {
      en: 'Traditional mangalsutra with modern touch',
      hi: 'आधुनिक स्पर्श के साथ पारंपरिक मांगलसूत्र'
    },
    price: 2999,
    originalPrice: 3999,
    stock: 8,
    rating: 4.8,
    reviewCount: 11,
    categoryId: 'cat-007', // Women Collection
    artisanId: 'priya-crafts',
    featured: true,
    bestSeller: false,
    newArrival: true,
    trending: false,
    isActive: true,
    createdAt: '2024-01-15',
    images: ['/images/products/Mangalsutra_Soni_Fashion_Ecommerce_a822.png']
  },
  {
    id: 'prod-016',
    slug: 'gold-anklet',
    title: {
      en: 'Gold Anklet',
      hi: 'सोने की पांव की कंघाई'
    },
    description: {
      en: 'Beautiful gold-plated anklet for women',
      hi: 'महिलाओं के लिए सुंदर सोने की प्लेटेड पांव की कंघाई'
    },
    price: 1299,
    originalPrice: 1799,
    stock: 18,
    rating: 4.3,
    reviewCount: 6,
    categoryId: 'cat-007', // Women Collection
    artisanId: 'soni-designer',
    featured: false,
    bestSeller: false,
    newArrival: true,
    trending: true,
    isActive: true,
    createdAt: '2024-01-16',
    images: ['/images/products/Gold_Anklet_Traditional_Soni_a677.png']
  },
  {
    id: 'prod-017',
    slug: 'gold-hair-chain',
    title: {
      en: 'Gold Hair Chain',
      hi: 'सोने की बाल की चेन'
    },
    description: {
      en: 'Elegant gold-plated hair chain for women',
      hi: 'महिलाओं के लिए सुरुचिपूर्ण सोने की प्लेटेड बाल की चेन'
    },
    price: 999,
    originalPrice: 1399,
    stock: 25,
    rating: 4.1,
    reviewCount: 8,
    categoryId: 'cat-007', // Women Collection
    artisanId: 'priya-crafts',
    featured: false,
    bestSeller: true,
    newArrival: false,
    trending: false,
    isActive: true,
    createdAt: '2024-01-17',
    images: ['/images/products/Gold_Hair_Chain_Product_Shot_hc567.png']
  },
  {
    id: 'prod-018',
    slug: 'gold-watch',
    title: {
      en: 'Gold Watch',
      hi: 'सोने की घड़ी'
    },
    description: {
      en: 'Luxury gold watch for women',
      hi: 'महिलाओं के लिए लक्ज़री सोने की घड़ी'
    },
    price: 4499,
    originalPrice: 5999,
    stock: 7,
    rating: 4.7,
    reviewCount: 9,
    categoryId: 'cat-007', // Women Collection
    artisanId: 'soni-designer',
    featured: true,
    bestSeller: false,
    newArrival: true,
    trending: false,
    isActive: true,
    createdAt: '2024-01-18',
    images: ['/images/products/Gold_Artisan_Watch_a282.png']
  },
  {
    id: 'prod-019',
    slug: 'gold-nose-ring',
    title: {
      en: 'Gold Nose Ring',
      hi: 'सोने की नाक की अंगूठी'
    },
    description: {
      en: 'Traditional gold nose ring for women',
      hi: 'महिलाओं के लिए पारंपरिक सोने की नाक की अंगूठी'
    },
    price: 799,
    originalPrice: 1199,
    stock: 30,
    rating: 4.0,
    reviewCount: 12,
    categoryId: 'cat-007', // Women Collection
    artisanId: 'priya-crafts',
    featured: false,
    bestSeller: true,
    newArrival: false,
    trending: true,
    isActive: true,
    createdAt: '2024-01-19',
    images: ['/images/products/Gold_Nose_Ring.png']
  },
  {
    id: 'prod-020',
    slug: 'gold-toe-ring',
    title: {
      en: 'Gold Toe Ring',
      hi: 'सोने की पांव की अंगूठी'
    },
    description: {
      en: 'Beautiful gold toe ring for women',
      hi: 'महिलाओं के लिए सुंदर सोने की पांव की अंगूठी'
    },
    price: 599,
    originalPrice: 899,
    stock: 22,
    rating: 4.2,
    reviewCount: 7,
    categoryId: 'cat-007', // Women Collection
    artisanId: 'soni-designer',
    featured: false,
    bestSeller: false,
    newArrival: true,
    trending: false,
    isActive: true,
    createdAt: '2024-01-20',
    images: ['/images/products/Gold_Toe_Ring_Soni_Traditional.png']
  }
];

// Mock categories data
const mockCategories: any[] = [
  {
    id: 'cat-006',
    name: {
      en: 'Men Collection',
      hi: 'पुरुष संग्रह'
    },
    description: {
      en: 'Elegant jewelry collection designed exclusively for men.',
      hi: 'पुरुषों के लिए विशेष रूप से डिज़ाइन किया गया सुरुचिपूर्ण आभूषण संग्रह।'
    },
    image: '/images/men collection/Gold_Figaro_Bracelet_Studio_Shot.png',
    parentId: null,
    displayOrder: 1,
    isActive: true,
    createdAt: '2024-01-01'
  },
  {
    id: 'cat-007',
    name: {
      en: 'Women Collection',
      hi: 'महिला संग्रह'
    },
    description: {
      en: 'Exquisite jewelry collection crafted for the modern woman.',
      hi: 'आधुनिक महिला के लिए तैयार किया गया शानदार आभूषण संग्रह।'
    },
    image: '/images/women collection/Golden_Radiance_Portrait.png',
    parentId: null,
    displayOrder: 2,
    isActive: true,
    createdAt: '2024-01-01'
  },
  {
    id: 'necklaces',
    name: {
      en: 'Necklaces',
      hi: 'हार'
    },
    description: {
      en: 'Stylish necklaces for every occasion',
      hi: 'हर अवसर के लिए स्टाइलिश हार'
    },
    image: '/images/processed/categories/1-gram-gold-plated-chain-for-men.jpg',
    parentId: null,
    displayOrder: 3,
    isActive: true,
    createdAt: '2024-01-01'
  },
  {
    id: 'earrings',
    name: {
      en: 'Earrings',
      hi: 'कान के आभूषण'
    },
    description: {
      en: 'Trendy earrings to complement your look',
      hi: 'आपके लुक को पूरा करने के लिए ट्रेंडी कान के आभूषण'
    },
    image: '/images/processed/categories/fashion-accessories-jewellery-men-women.jpg',
    parentId: null,
    displayOrder: 4,
    isActive: true,
    createdAt: '2024-01-01'
  },
  {
    id: 'bracelets',
    name: {
      en: 'Bracelets',
      hi: 'कंगन'
    },
    description: {
      en: 'Beautiful bracelets for your wrist',
      hi: 'आपकी कलाई के लिए सुंदर कंगन'
    },
    image: '/images/processed/categories/women-gold-plated-jewellery-accessory-collection.jpg',
    parentId: null,
    displayOrder: 5,
    isActive: true,
    createdAt: '2024-01-01'
  },
  {
    id: 'rings',
    name: {
      en: 'Rings',
      hi: 'अंगूठियाँ'
    },
    description: {
      en: 'Elegant rings for a perfect finish',
      hi: 'एक आदर्श खत्म करने के लिए शिक्षित अंगूठियाँ'
    },
    image: '/images/processed/categories/1-gram-gold-plated-chain-for-men.jpg',
    parentId: null,
    displayOrder: 6,
    isActive: true,
    createdAt: '2024-01-01'
  },
  {
    id: 'fashion-accessories',
    name: {
      en: 'Fashion Accessories',
      hi: 'फैशन सहायक उत्पाद'
    },
    description: {
      en: 'Complete your look with our accessories',
      hi: 'हमारे सहायक उत्पादों के साथ अपने लुक को पूरा करें'
    },
    image: '/images/processed/categories/fashion-accessories-jewellery-men-women.jpg',
    parentId: null,
    displayOrder: 7,
    isActive: true,
    createdAt: '2024-01-01'
  }
];

// Mock artisans data
let mockArtisans: any[] = [
  {
    id: 'soni-designer',
    name: 'Soni Designer',
    bio: {
      en: 'Master designer specializing in artificial fashion jewelry with over 15 years of experience.',
      hi: 'कृत्रिम फैशन आभूषण में विशेषज्ञता रखने वाले मास्टर डिजाइनर, 15 से अधिक वर्षों का अनुभव।'
    },
    specialization: 'Artificial Jewelry Design',
    location: 'Delhi, India',
    phone: '+91 9876543210',
    email: 'designer@sonifashion.com',
    avatar: '/images/artisans/soni-designer.jpg',
    experienceYears: 15,
    rating: 4.9,
    isVerified: true,
    createdAt: '2024-01-01'
  },
  {
    id: 'priya-crafts',
    name: 'Priya Crafts',
    bio: {
      en: 'Skilled artisan known for creating beautiful artificial jewelry using traditional techniques.',
      hi: 'पारंपरिक तकनीकों का उपयोग करके सुंदर कृत्रिम आभूषण बनाने के लिए जानी जाने वाली कुशल कारीगर।'
    },
    specialization: 'Artificial Jewelry Making',
    location: 'Mumbai, India',
    phone: '+91 9876543211',
    email: 'priya@sonifashion.com',
    avatar: '/images/artisans/priya-crafts.jpg',
    experienceYears: 12,
    rating: 4.7,
    isVerified: true,
    createdAt: '2024-01-01'
  }
];

// Mock cart items
let mockCartItems: any[] = [];

// Mock wishlist items
let mockWishlistItems: any[] = [];

// Mock orders
let mockOrders: any[] = [];

// Mock order items
let mockOrderItems: any[] = [];

// Mock addresses
let mockAddresses: any[] = [];

// Mock database operations
export const mockDb = {
  // User operations
  async findUserByEmail(email: string): Promise<any | null> {
    const user = mockUsers.find((u: any) => u.email === email);
    return user || null;
  },

  async findUserById(id: string): Promise<any | null> {
    const user = mockUsers.find((u: any) => u.id === id);
    return user || null;
  },

  async createUser(userData: any): Promise<any> {
    const newUser = {
      id: `user-${Date.now()}`,
      ...userData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    return newUser;
  },

  async updateUser(id: string, userData: any): Promise<any | null> {
    const userIndex = mockUsers.findIndex((u: any) => u.id === id);
    if (userIndex === -1) return null;
    
    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      ...userData,
      updated_at: new Date().toISOString()
    };
    
    return mockUsers[userIndex];
  },

  // Product operations
  async getProductBySlug(slug: string): Promise<any | null> {
    const product = mockProducts.find((p: any) => p.slug === slug);
    if (!product) return null;
    
    const category = mockCategories.find((c: any) => c.id === product.categoryId);
    const artisan = mockArtisans.find((a: any) => a.id === product.artisanId);
    
    return {
      ...product,
      category: category ? {
        id: category.id,
        name: category.name,
        slug: category.slug
      } : null,
      artisan: artisan ? {
        id: artisan.id,
        name: artisan.name,
        village: artisan.village
      } : null,
      productImages: product.images.map((url: string, index: number) => ({
        url,
        isPrimary: index === 0
      }))
    };
  },

  async getProducts(filters: any): Promise<any[]> {
    let filteredProducts = [...mockProducts];
    
    // Apply category filter
    if (filters.category) {
      filteredProducts = filteredProducts.filter(product => product.categoryId === filters.category);
    }
    
    // Apply featured filter
    if (filters.featured) {
      filteredProducts = filteredProducts.filter(product => product.featured);
    }
    
    // Apply best seller filter
    if (filters.bestSeller) {
      filteredProducts = filteredProducts.filter(product => product.bestSeller);
    }
    
    // Apply new arrival filter
    if (filters.newArrival) {
      filteredProducts = filteredProducts.filter(product => product.newArrival);
    }
    
    // Limit results
    if (filters.limit) {
      filteredProducts = filteredProducts.slice(0, filters.limit);
    }
    
    // Enhance products with category and artisan data
    return filteredProducts.map(product => {
      const category = mockCategories.find((c: any) => c.id === product.categoryId);
      const artisan = mockArtisans.find((a: any) => a.id === product.artisanId);
      
      return {
        ...product,
        category: category ? {
          id: category.id,
          name: category.name,
          slug: category.slug
        } : null,
        artisan: artisan ? {
          id: artisan.id,
          name: artisan.name,
          village: artisan.village
        } : null,
        productImages: product.images.map((url: string, index: number) => ({
          url,
          isPrimary: index === 0
        }))
      };
    });
  },

  async searchProducts(searchParams: any): Promise<any> {
    let filteredProducts = [...mockProducts];
    
    // Search filter
    if (searchParams.query) {
      const query = searchParams.query.toLowerCase();
      filteredProducts = filteredProducts.filter(product => {
        const titleMatch = product.title.en.toLowerCase().includes(query) || 
                          product.title.hi.toLowerCase().includes(query);
        const descriptionMatch = product.description.en.toLowerCase().includes(query) || 
                                product.description.hi.toLowerCase().includes(query);
        const tagMatch = product.tags?.some((tag: string) => tag.toLowerCase().includes(query));
        const materialMatch = product.material?.toLowerCase().includes(query);
        
        return titleMatch || descriptionMatch || tagMatch || materialMatch;
      });
    }
    
    // Category filter
    if (searchParams.category && searchParams.category !== 'all') {
      filteredProducts = filteredProducts.filter(product => product.categoryId === searchParams.category);
    }
    
    // Price filter
    if (searchParams.minPrice || searchParams.maxPrice) {
      if (searchParams.minPrice) {
        filteredProducts = filteredProducts.filter(product => product.price >= searchParams.minPrice);
      }
      if (searchParams.maxPrice) {
        filteredProducts = filteredProducts.filter(product => product.price <= searchParams.maxPrice);
      }
    }
    
    // Sort products
    filteredProducts.sort((a, b) => {
      switch (searchParams.sortBy) {
        case 'price_low_high':
          return a.price - b.price;
        case 'price_high_low':
          return b.price - a.price;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'name':
          return a.title.en.localeCompare(b.title.en);
        default: // relevance
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
    
    // Get total count
    const totalCount = filteredProducts.length;
    
    // Paginate results
    const startIndex = (searchParams.page - 1) * searchParams.limit;
    const endIndex = startIndex + searchParams.limit;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
    
    // Transform the data to match the expected format
    const transformedProducts = paginatedProducts.map((product: any) => {
      const productCategory = mockCategories.find(cat => cat.id === product.categoryId);
      const productArtisan = mockArtisans.find(art => art.id === product.artisanId);
      
      return {
        id: product.id,
        slug: product.slug,
        title: product.title,
        description: product.description,
        price: product.price,
        originalPrice: product.originalPrice,
        stock: product.stock,
        inStock: product.stock > 0,
        featured: product.featured,
        bestSeller: product.bestSeller,
        newArrival: product.newArrival,
        trending: product.trending,
        rating: product.rating,
        reviewCount: product.reviewCount,
        images: product.images,
        productImages: product.images.map((url: string, index: number) => ({
          url,
          isPrimary: index === 0
        })),
        category: productCategory ? {
          id: productCategory.id,
          name: productCategory.name,
          slug: productCategory.slug
        } : null,
        artisan: productArtisan ? {
          id: productArtisan.id,
          name: productArtisan.name,
          village: productArtisan.village
        } : null,
        tags: product.tags || [],
        materials: product.material ? [product.material] : [],
        createdAt: product.createdAt
      };
    });
    
    return {
      products: transformedProducts,
      pagination: {
        currentPage: searchParams.page || 1,
        totalPages: Math.ceil(totalCount / (searchParams.limit || 10)),
        totalProducts: totalCount,
        hasNextPage: endIndex < totalCount,
        hasPrevPage: searchParams.page > 1
      }
    };
  },

  // Cart operations
  async getCartItems(userId: string): Promise<CartItem[]> {
    // Return cart items that match the CartItem interface from types.ts
    return mockCartItems
      .filter(item => item.user_id === userId)
      .map(cartItem => ({
        productId: cartItem.product_id,
        quantity: cartItem.quantity,
        variant: cartItem.variant
      }));
  },

  async addToCart(userId: string, productId: string, quantity: number): Promise<CartItem> {
    const existingItemIndex = mockCartItems.findIndex(
      item => item.user_id === userId && item.product_id === productId
    );
    
    if (existingItemIndex >= 0) {
      // Update existing item
      mockCartItems[existingItemIndex].quantity += quantity;
      return {
        productId: mockCartItems[existingItemIndex].product_id,
        quantity: mockCartItems[existingItemIndex].quantity,
        variant: mockCartItems[existingItemIndex].variant
      };
    } else {
      // Create new item
      const cartItem: any = {
        id: `cart-${Date.now()}`,
        user_id: userId,
        product_id: productId,
        quantity: quantity,
        created_at: new Date().toISOString()
      };
      mockCartItems.push(cartItem);
      return {
        productId: cartItem.product_id,
        quantity: cartItem.quantity,
        variant: cartItem.variant
      };
    }
  },

  async removeFromCart(userId: string, productId: string, variant?: any): Promise<boolean> {
    const initialLength = mockCartItems.length;
    mockCartItems = mockCartItems.filter(
      item => !(item.user_id === userId && item.product_id === productId)
    );
    return mockCartItems.length < initialLength;
  },

  async updateCartItemQuantity(userId: string, productId: string, quantity: number): Promise<boolean> {
    const itemIndex = mockCartItems.findIndex(
      item => item.user_id === userId && item.product_id === productId
    );
    
    if (itemIndex >= 0) {
      mockCartItems[itemIndex].quantity = quantity;
      return true;
    }
    
    return false;
  },

  async clearCart(userId: string): Promise<boolean> {
    const initialLength = mockCartItems.length;
    mockCartItems = mockCartItems.filter(item => item.user_id !== userId);
    return mockCartItems.length < initialLength;
  },

  // Order operations
  async createOrder(orderData: any): Promise<any> {
    // Create address if it doesn't exist
    let address = mockAddresses.find(
      addr => addr.userId === orderData.userId &&
              addr.phone === orderData.address.phone &&
              addr.address === orderData.address.address &&
              addr.city === orderData.address.city &&
              addr.state === orderData.address.state &&
              addr.pincode === orderData.address.pincode
    );
    
    if (!address) {
      address = {
        id: `addr-${Date.now()}`,
        userId: orderData.userId,
        name: orderData.address.fullName,
        phone: orderData.address.phone,
        address: orderData.address.address,
        city: orderData.address.city,
        state: orderData.address.state,
        pincode: orderData.address.pincode,
        type: 'HOME',
        created_at: new Date().toISOString()
      };
      mockAddresses.push(address);
    }
    
    // Create order
    const order = {
      id: `order-${Date.now()}`,
      orderNumber: orderData.orderNumber,
      userId: orderData.userId,
      addressId: address.id,
      subtotal: orderData.subtotal,
      shippingFee: orderData.shipping,
      tax: orderData.tax,
      totalAmount: orderData.total,
      paymentMethod: orderData.paymentMethod,
      status: 'PENDING',
      // Set payment status based on payment method
      paymentStatus: orderData.paymentMethod === 'cod' ? 'PENDING' : 'COMPLETED',
      created_at: new Date().toISOString()
    };
    mockOrders.push(order);
    
    // Create order items
    for (const item of orderData.items) {
      // In a real implementation, we would create order items
    }
    
    return {
      id: order.id,
      orderNumber: order.orderNumber,
      totalAmount: order.totalAmount
    };
  },

  async getOrderById(orderId: string): Promise<any | null> {
    const order = mockOrders.find(o => o.id === orderId);
    if (!order) return null;
    
    // Get order items (mock implementation)
    const orderItems = mockOrderItems.filter((item: any) => item.orderId === orderId);
    
    // Get user info
    const user = mockUsers.find(u => u.id === order.userId);
    
    // Get address info
    const address = mockAddresses.find(a => a.id === order.addressId);
    
    return {
      ...order,
      user: user ? {
        id: user.id,
      } : null,
      address: address ? {
        id: address.id,
        name: address.name,
        phone: address.phone,
        address: address.address,
        city: address.city,
        state: address.state,
        pincode: address.pincode
      } : null,
      items: orderItems
    };
  },

  async getOrdersByUserId(userId: string): Promise<any[]> {
    const userOrders = mockOrders.filter(order => order.userId === userId);
    
    // Enhance orders with user and address info
    return userOrders.map(order => {
      const user = mockUsers.find(u => u.id === order.userId);
      const address = mockAddresses.find(a => a.id === order.addressId);
      const orderItems = mockOrderItems.filter((item: any) => item.orderId === order.id);
      
      return {
        ...order,
        user: user ? {
          id: user.id,
        } : null,
        address: address ? {
          id: address.id,
          name: address.name,
          phone: address.phone,
          address: address.address,
          city: address.city,
          state: address.state,
          pincode: address.pincode
        } : null,
        items: orderItems
      };
    });
  },

  // Wishlist operations
  async getWishlistItems(userId: string): Promise<WishlistItem[]> {
    return mockWishlistItems.filter(item => item.user_id === userId);
  },

  async addToWishlist(userId: string, productId: string): Promise<any> {
    const existingItemIndex = mockWishlistItems.findIndex(
      item => item.user_id === userId && item.product_id === productId
    );
    
    if (existingItemIndex === -1) {
      // Add new item if it doesn't exist
      const wishlistItem: any = {
        id: `wishlist-${Date.now()}`,
        user_id: userId,
        product_id: productId,
        created_at: new Date().toISOString()
      };
      mockWishlistItems.push(wishlistItem);
      return wishlistItem;
    }
    
    return mockWishlistItems[existingItemIndex];
  },

  async removeFromWishlist(userId: string, productId: string): Promise<boolean> {
    const initialLength = mockWishlistItems.length;
    mockWishlistItems = mockWishlistItems.filter(
      item => !(item.user_id === userId && item.product_id === productId)
    );
    return mockWishlistItems.length < initialLength;
  },
  
  async clearWishlist(userId: string): Promise<boolean> {
    const initialLength = mockWishlistItems.length;
    mockWishlistItems = mockWishlistItems.filter(item => item.user_id !== userId);
    return mockWishlistItems.length < initialLength;
  },
  
  // Admin operations for mock database
  async getAllProducts(): Promise<any[]> {
    // Enhance products with category and artisan data and proper image mapping
    return mockProducts.map(product => {
      const category = mockCategories.find((c: any) => c.id === product.categoryId);
      const artisan = mockArtisans.find((a: any) => a.id === product.artisanId);
      
      return {
        ...product,
        category: category ? {
          id: category.id,
          name: category.name,
          slug: category.slug
        } : null,
        artisan: artisan ? {
          id: artisan.id,
          name: artisan.name,
          village: artisan.village
        } : null,
        productImages: product.images.map((url: string, index: number) => ({
          url,
          isPrimary: index === 0
        }))
      };
    });
  },
  
  async createProduct(productData: any): Promise<any> {
    // Generate a new ID for the product
    const newId = `prod-${Date.now()}`;
    
    // Create the product object
    const newProduct = {
      id: newId,
      ...productData,
      // Map images array to the format expected by the frontend
      images: productData.images || [],
      imageFilenames: productData.imageFilenames || [], // Store filenames
      // Set default values for boolean fields if not provided
      featured: productData.featured || false,
      bestSeller: productData.bestSeller || false,
      newArrival: productData.newArrival || false,
      trending: productData.trending || false,
      isActive: productData.isActive !== undefined ? productData.isActive : true,
      rating: productData.rating || 0,
      reviewCount: productData.reviewCount || 0,
      createdAt: new Date().toISOString()
    };
    
    // Add the new product to the mockProducts array
    mockProducts.push(newProduct);
    
    // Return the created product with enhanced data
    const category = mockCategories.find((c: any) => c.id === newProduct.categoryId);
    const artisan = mockArtisans.find((a: any) => a.id === newProduct.artisanId);
    
    return {
      ...newProduct,
      category: category ? {
        id: category.id,
        name: category.name,
        slug: category.slug
      } : null,
      artisan: artisan ? {
        id: artisan.id,
        name: artisan.name,
        village: artisan.village
      } : null,
      productImages: newProduct.images.map((url: string, index: number) => ({
        url,
        filename: newProduct.imageFilenames[index] || '', // Include filename
        isPrimary: index === 0
      }))
    };
  },
  
  async getAllCategories(): Promise<any[]> {
    // Enhance categories with product counts
    return mockCategories.map(category => {
      // Count products in this category
      const productCount = mockProducts.filter(product => product.categoryId === category.id).length;
      
      return {
        ...category,
        productCount // Include product count
      };
    });
  },
  
  async getAllArtisans(): Promise<any[]> {
    return mockArtisans;
  },
  
  async getAllBanners(): Promise<any[]> {
    return []; // Return empty array for banners in mock
  },
  
  async getDashboardStats(): Promise<any> {
    return {
      totalProducts: mockProducts.length,
      totalOrders: mockOrders.length,
      totalUsers: mockUsers.length,
      totalArtisans: mockArtisans.length
    };
  },
  
  async getTotalRevenue(): Promise<number> {
    return mockOrders.reduce((total, order) => total + (order.totalAmount || 0), 0);
  },
  
  async getCustomerGrowth(): Promise<any> {
    // Mock implementation - return dummy data for customer growth
    // In a real implementation, this would calculate customer growth over time
    return {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      data: [120, 190, 150, 220, 180, 250]
    };
  },
  
  async getRecentOrders(limit: number = 5): Promise<any[]> {
    // Mock implementation - return recent orders from mock data
    // Sort by created_at and return the most recent ones
    return mockOrders
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit)
      .map(order => {
        const user = mockUsers.find(u => u.id === order.userId);
        return {
          ...order,
          user: user ? { id: user.id, name: user.name } : null
        };
      });
  },
  
  async getReturnsReport(): Promise<any> {
    // Mock implementation - return dummy data for returns report
    // In a real implementation, this would calculate returns data
    return {
      totalReturns: 12,
      returnRate: 2.4,
      refundAmount: 24500,
      topReturnReasons: [
        { reason: 'Damaged Product', count: 5 },
        { reason: 'Wrong Item', count: 3 },
        { reason: 'Not as Expected', count: 4 }
      ]
    };
  },
  
  async getSalesOverview(): Promise<any> {
    // Mock implementation - return dummy data for sales overview
    // In a real implementation, this would calculate sales data
    return {
      totalSales: 1250000,
      totalOrders: 245,
      averageOrderValue: 5102,
      salesByCategory: [
        { category: 'Necklaces', sales: 420000 },
        { category: 'Earrings', sales: 310000 },
        { category: 'Bracelets', sales: 280000 },
        { category: 'Rings', sales: 240000 }
      ]
    };
  },
  
  async getTopCategories(): Promise<any[]> {
    // Mock implementation - return top categories from mock data
    return mockCategories.map(category => {
      // Count products in this category
      const productCount = mockProducts.filter(p => p.categoryId === category.id).length;
      return {
        ...category,
        productCount
      };
    }).sort((a, b) => b.productCount - a.productCount).slice(0, 5);
  },
  
  async getTopProducts(): Promise<any[]> {
    // Mock implementation - return top products from mock data
    // Sort by rating and return top 5
    return mockProducts
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 5)
      .map(product => {
        const category = mockCategories.find(c => c.id === product.categoryId);
        const artisan = mockArtisans.find(a => a.id === product.artisanId);
        return {
          ...product,
          category: category ? { name: category.name } : null,
          artisan: artisan ? { name: artisan.name } : null
        };
      });
  },
  
  async updateArtisan(id: string, artisanData: any): Promise<any> {
    // Mock implementation - update artisan in mock data
    const artisanIndex = mockArtisans.findIndex(a => a.id === id);
    if (artisanIndex === -1) return null;
    
    mockArtisans[artisanIndex] = {
      ...mockArtisans[artisanIndex],
      ...artisanData,
      updated_at: new Date().toISOString()
    };
    
    return mockArtisans[artisanIndex];
  },
  
  async deleteArtisan(id: string): Promise<boolean> {
    // Mock implementation - delete artisan from mock data
    const initialLength = mockArtisans.length;
    // Filter out the artisan with the given ID
    const newArtisans = mockArtisans.filter(a => a.id !== id);
    // If the length changed, the artisan was found and removed
    if (newArtisans.length < initialLength) {
      // We can't reassign mockArtisans since it's const, so we'll clear and repopulate
      mockArtisans.splice(0, mockArtisans.length, ...newArtisans);
      return true;
    }
    return false;
  },
  
  async createArtisan(artisanData: any): Promise<any> {
    // Mock implementation - create artisan in mock data
    const newArtisan = {
      id: `artisan-${Date.now()}`,
      ...artisanData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    mockArtisans.push(newArtisan);
    return newArtisan;
  },
  
  async getAllAdminUsers(): Promise<any[]> {
    // Mock implementation - return admin users from mock data
    return mockUsers.filter(user => user.role === 'admin' || user.role === 'super_admin');
  },
  
  async updateOrder(orderId: string, updateData: any): Promise<any | null> {
    // Mock implementation - update order in mock data
    const orderIndex = mockOrders.findIndex(order => order.id === orderId);
    if (orderIndex === -1) return null;
    
    mockOrders[orderIndex] = {
      ...mockOrders[orderIndex],
      ...updateData,
      updated_at: new Date().toISOString()
    };
    
    // Return the updated order with user and address info
    const order = mockOrders[orderIndex];
    const user = mockUsers.find(u => u.id === order.userId);
    const address = mockAddresses.find(a => a.id === order.addressId);
    
    return {
      ...order,
      user: user ? { id: user.id, name: user.name } : null,
      address: address ? { 
        id: address.id,
        name: address.name,
        phone: address.phone,
        address: address.address,
        city: address.city,
        state: address.state,
        pincode: address.pincode
      } : null
    };
  },

  async updateOrderStatus(orderId: string, status: string): Promise<boolean> {
    // Mock implementation - update order status in mock data
    const orderIndex = mockOrders.findIndex(order => order.id === orderId);
    if (orderIndex === -1) return false;
    
    mockOrders[orderIndex] = {
      ...mockOrders[orderIndex],
      status,
      updated_at: new Date().toISOString()
    };
    
    return true;
  },
  
  // Add missing banner functions
  async createBanner(bannerData: any): Promise<any> {
    // Mock implementation - create banner in mock data
    const newBanner = {
      id: `banner-${Date.now()}`,
      ...bannerData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // For mock purposes, we'll just return the created banner
    // In a real implementation, you would store it in a mockBanners array
    return newBanner;
  },
  
  async updateBanner(id: string, bannerData: any): Promise<any> {
    // Mock implementation - update banner in mock data
    // For mock purposes, we'll just return the updated banner data
    return {
      id,
      ...bannerData,
      updated_at: new Date().toISOString()
    };
  },
  
  async deleteBanner(id: string): Promise<boolean> {
    // Mock implementation - delete banner
    // For mock purposes, we'll just return true
    return true;
  },
  
  // Add missing product functions
  async updateProduct(id: string, productData: any): Promise<any> {
    // Mock implementation - update product in mock data
    const productIndex = mockProducts.findIndex(p => p.id === id);
    if (productIndex === -1) return null;
    
    mockProducts[productIndex] = {
      ...mockProducts[productIndex],
      ...productData,
      updated_at: new Date().toISOString()
    };
    
    // Return the updated product with enhanced data
    const category = mockCategories.find((c: any) => c.id === mockProducts[productIndex].categoryId);
    const artisan = mockArtisans.find((a: any) => a.id === mockProducts[productIndex].artisanId);
    
    return {
      ...mockProducts[productIndex],
      category: category ? {
        id: category.id,
        name: category.name,
        slug: category.slug
      } : null,
      artisan: artisan ? {
        id: artisan.id,
        name: artisan.name,
        village: artisan.village
      } : null,
      productImages: mockProducts[productIndex].images.map((url: string, index: number) => ({
        url,
        filename: mockProducts[productIndex].imageFilenames[index] || '', // Include filename
        isPrimary: index === 0
      }))
    };
  },
  
  async deleteProduct(id: string): Promise<boolean> {
    // Mock implementation - delete product from mock data
    const initialLength = mockProducts.length;
    // Filter out the product with the given ID
    const newProducts = mockProducts.filter(p => p.id !== id);
    // If the length changed, the product was found and removed
    if (newProducts.length < initialLength) {
      // We can't reassign mockProducts since it's const, so we'll clear and repopulate
      mockProducts.splice(0, mockProducts.length, ...newProducts);
      return true;
    }
    return false;
  },
  
  // Add missing category functions
  async createCategory(categoryData: any): Promise<any> {
    // Mock implementation - create category in mock data
    const newCategory = {
      id: `cat-${Date.now()}`,
      ...categoryData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // For mock purposes, we'll just return the created category
    // In a real implementation, you would store it in a mockCategories array
    return newCategory;
  },
  
  async updateCategory(id: string, categoryData: any): Promise<any> {
    // Mock implementation - update category in mock data
    // For mock purposes, we'll just return the updated category data
    return {
      id,
      ...categoryData,
      updated_at: new Date().toISOString()
    };
  },
  
  async deleteCategory(id: string): Promise<boolean> {
    // Mock implementation - delete category
    // For mock purposes, we'll just return true
    return true;
  },
  
  async getCategoryById(id: string): Promise<any | null> {
    // Mock implementation - get category by ID
    // For mock purposes, we'll just return null
    return null;
  }

};

export default mockDb;
