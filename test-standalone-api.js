// Standalone test of the API logic
const mysql = require('mysql2/promise');

// Database configuration
const dbConfig = {
  host: 'auth-db1555.hstgr.io',
  user: 'u632940212_u632940212_fas',
  password: 'Soni@2k25$$',
  database: 'u632940212_u632940212_son',
  port: 3306,
  connectionLimit: 10
};

async function searchProducts(searchParams) {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    
    let query = `
      SELECT p.*, c.name_en as category_name_en, c.name_hi as category_name_hi, 
      c.id as category_id, a.name as artisan_name, a.id as artisan_id
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN artisans a ON p.artisan_id = a.id
      WHERE p.is_active = 1
    `;
    
    const params = [];
    const page = parseInt(searchParams.page) || 1;
    const limit = parseInt(searchParams.limit) || 12;
    const offset = (page - 1) * limit;
    
    // Apply search filters
    if (searchParams.category) {
      query += ' AND p.category_id = ?';
      params.push(searchParams.category);
    }
    
    if (searchParams.featured === true || searchParams.featured === 'true') {
      query += ' AND p.featured = 1';
    }
    
    if (searchParams.bestSeller === true || searchParams.bestSeller === 'true') {
      query += ' AND p.best_seller = 1';
    }
    
    if (searchParams.newArrival === true || searchParams.newArrival === 'true') {
      query += ' AND p.new_arrival = 1';
    }
    
    if (searchParams.trending === true || searchParams.trending === 'true') {
      query += ' AND p.trending = 1';
    }
    
    // Add search term filter if provided
    if (searchParams.search) {
      query += ' AND (p.title_en LIKE ? OR p.title_hi LIKE ? OR p.description_en LIKE ? OR p.description_hi LIKE ?)';
      const searchTerm = `%${searchParams.search}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }
    
    // Get total count for pagination
    let countQuery = `SELECT COUNT(*) as total FROM products p WHERE p.is_active = 1`;
    const countParams = [];
    
    // Apply the same filters to the count query
    if (searchParams.category) {
      countQuery += ' AND p.category_id = ?';
      countParams.push(searchParams.category);
    }
    
    if (searchParams.featured === true || searchParams.featured === 'true') {
      countQuery += ' AND p.featured = 1';
    }
    
    if (searchParams.bestSeller === true || searchParams.bestSeller === 'true') {
      countQuery += ' AND p.best_seller = 1';
    }
    
    if (searchParams.newArrival === true || searchParams.newArrival === 'true') {
      countQuery += ' AND p.new_arrival = 1';
    }
    
    if (searchParams.trending === true || searchParams.trending === 'true') {
      countQuery += ' AND p.trending = 1';
    }
    
    // Add search term filter if provided
    if (searchParams.search) {
      countQuery += ' AND (p.title_en LIKE ? OR p.title_hi LIKE ? OR p.description_en LIKE ? OR p.description_hi LIKE ?)';
      const searchTerm = `%${searchParams.search}%`;
      countParams.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }
    
    const [countResult] = await connection.execute(countQuery, countParams);
    const totalProducts = countResult[0].total;
    
    // Add ordering and pagination
    query += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);
    
    const [rows] = await connection.execute(query, params);
    
    // Enhance products with images
    const products = await Promise.all(rows.map(async (product) => {
      // Get product images
      const [images] = await connection.execute(
        'SELECT * FROM product_images WHERE product_id = ? ORDER BY display_order',
        [product.id]
      );
      
      return {
        id: product.id,
        slug: product.slug,
        title: { en: product.title_en, hi: product.title_hi },
        description: { en: product.description_en, hi: product.description_hi },
        price: product.price,
        originalPrice: product.original_price,
        stock: product.stock,
        rating: product.rating,
        reviewCount: product.review_count,
        categoryId: product.category_id,
        artisanId: product.artisan_id,
        featured: product.featured,
        bestSeller: product.best_seller,
        newArrival: product.new_arrival,
        trending: product.trending,
        isActive: product.is_active,
        createdAt: product.created_at,
        updatedAt: product.updated_at,
        category: product.category_id ? {
          id: product.category_id,
          name: { en: product.category_name_en, hi: product.category_name_hi }
        } : null,
        artisan: product.artisan_id ? {
          id: product.artisan_id,
          name: product.artisan_name
        } : null,
        productImages: images.map(img => ({
          id: img.id,
          url: img.image_url,
          isPrimary: img.is_primary,
          displayOrder: img.display_order
        }))
      };
    }));
    
    await connection.end();
    
    return {
      products,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalProducts / limit),
        totalProducts,
        hasNextPage: page < Math.ceil(totalProducts / limit),
        hasPrevPage: page > 1
      }
    };
  } catch (error) {
    console.error('Database error:', error);
    if (connection) {
      await connection.end();
    }
    return {
      products: [],
      pagination: {
        currentPage: 1,
        totalPages: 0,
        totalProducts: 0,
        hasNextPage: false,
        hasPrevPage: false
      }
    };
  }
}

// Format products for frontend (same logic as in the API route)
function formatProductsForFrontend(products) {
  return products.map((product) => {
    // Get the primary image if available
    const primaryImage = product.productImages && product.productImages.length > 0 
      ? product.productImages.find((img) => img.isPrimary) || product.productImages[0]
      : null;
    
    return {
      id: product.id,
      slug: product.slug,
      title: product.title, // Keep the title as an object with en and hi properties
      description: product.description, // Keep the description as an object with en and hi properties
      price: product.price,
      original_price: product.originalPrice,
      stock: product.stock,
      rating: product.rating,
      review_count: product.reviewCount,
      category: product.category,
      images: primaryImage ? [primaryImage.url] : product.images || [],
      productImages: product.productImages,
      featured: product.featured,
      best_seller: product.bestSeller,
      new_arrival: product.newArrival,
      trending: product.trending,
      is_active: product.isActive,
      created_at: product.createdAt
    };
  });
}

async function testStandaloneApi() {
  try {
    console.log('Testing standalone API logic...');
    
    // Test with no filters
    const result = await searchProducts({ page: 1 });
    
    // Format products for frontend
    const formattedProducts = formatProductsForFrontend(result.products);
    
    const response = {
      success: true,
      products: formattedProducts,
      pagination: result.pagination,
      count: formattedProducts.length
    };
    
    console.log('API response:', {
      success: response.success,
      products: response.products.length,
      pagination: response.pagination,
      count: response.count
    });
    
    // Show first product if available
    if (response.products.length > 0) {
      console.log('First product sample:', {
        id: response.products[0].id,
        slug: response.products[0].slug,
        title: response.products[0].title,
        price: response.products[0].price,
        category: response.products[0].category
      });
    }
    
    return response;
  } catch (error) {
    console.error('Error testing standalone API:', error);
    return {
      success: false,
      error: 'Failed to fetch products',
      products: []
    };
  }
}

testStandaloneApi();