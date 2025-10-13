// Mock database implementation for development
import { User, CartItem, WishlistItem, Address } from '@/data/types';

// Mock users data
const mockUsers: any[] = [
  {
    id: '1',
    email: 'admin@lettex.com',
    password: '$2a$12$example_hashed_password', // In a real app, this would be properly hashed
    name: 'Admin User',
    role: 'super_admin',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    email: 'user@lettex.com',
    password: '$2a$12$example_hashed_password', // In a real app, this would be properly hashed
    name: 'Demo User',
    role: 'customer',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

// Mock products data
const mockProducts: any[] = [
  {
    id: 'bamboo-wall-art-001',
    slug: 'bamboo-wall-art',
    title: {
      en: 'Bamboo Wall Art',
      hi: 'बांस की दीवार कला'
    },
    description: {
      en: 'Handcrafted by skilled Pachmarhi artisans, this bamboo wall art reflects centuries of tradition and artistry. Perfect for gifting or decorating your home with authentic tribal charm.',
      hi: 'कुशल पचमढ़ी के कारीगरों द्वारा हस्तनिर्मित, यह बांस की दीवार कला शताब्दियों की परंपरा और कला को दर्शाता है। उपहार देने या अपने घर को प्रमाणिक जनजातीय आकर्षण के साथ सजाने के लिए उपयुक्त।'
    },
    price: 2499,
    originalPrice: 3499,
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
    featured: false,
    bestSeller: true,
    trending: true,
    newArrival: false,
    createdAt: '2024-01-20'
  }
];

// Mock categories data
const mockCategories: any[] = [
  {
    id: 'home-decor',
    slug: 'home-decor',
    name: {
      en: 'Home Decor',
      hi: 'घर की सजावट'
    }
  },
  {
    id: 'jewelry',
    slug: 'jewelry',
    name: {
      en: 'Jewelry',
      hi: 'आभूषण'
    }
  },
  {
    id: 'handloom-textiles',
    slug: 'handloom-textiles',
    name: {
      en: 'Handloom Textiles',
      hi: 'हैंडलूम कपड़े'
    }
  }
];

// Mock artisans data
const mockArtisans: any[] = [
  {
    id: 'sarla-bai',
    slug: 'sarla-bai',
    name: 'Sarla Bai',
    village: 'Pachmarhi'
  },
  {
    id: 'meera-gond',
    slug: 'meera-gond',
    name: 'Meera Gond',
    village: 'Pipariya'
  },
  {
    id: 'ramesh-uikey',
    slug: 'ramesh-uikey',
    name: 'Ramesh Uikey',
    village: 'Hoshangabad'
  }
];

// Mock cart items
let mockCartItems: any[] = [];

// Mock wishlist items
let mockWishlistItems: any[] = [];

// Mock orders
let mockOrders: any[] = [];

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
        } : null
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
        currentPage: searchParams.page,
        totalPages: Math.ceil(totalCount / searchParams.limit),
        totalProducts: totalCount,
        hasNextPage: endIndex < totalCount,
        hasPrevPage: searchParams.page > 1
      }
    };
  },

  // Cart operations
  async getCartItems(userId: string): Promise<CartItem[]> {
    return mockCartItems.filter(item => item.user_id === userId);
  },

  async addToCart(userId: string, productId: string, quantity: number): Promise<CartItem> {
    const existingItemIndex = mockCartItems.findIndex(
      item => item.user_id === userId && item.product_id === productId
    );
    
    if (existingItemIndex >= 0) {
      // Update existing item
      mockCartItems[existingItemIndex].quantity += quantity;
      return mockCartItems[existingItemIndex];
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
      return cartItem;
    }
  },

  async removeFromCart(userId: string, productId: string): Promise<boolean> {
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
};