const http = require('http');

async function testApiEndpoints() {
  console.log('Testing API endpoints...\n');
  
  // Test products API
  try {
    console.log('1. Testing /api/products endpoint...');
    const productsResponse = await fetch('http://localhost:3000/api/products');
    const productsData = await productsResponse.json();
    console.log(`   Status: ${productsResponse.status}`);
    console.log(`   Success: ${productsData.success}`);
    console.log(`   Products count: ${productsData.count}`);
    if (productsData.products && productsData.products.length > 0) {
      console.log(`   First product: ${productsData.products[0].title?.en || productsData.products[0].title}`);
      console.log(`   First product image: ${productsData.products[0].images?.[0] || 'No image'}`);
    }
    console.log('');
  } catch (error) {
    console.log(`   Error testing products API: ${error.message}\n`);
  }
  
  // Test banners API
  try {
    console.log('2. Testing /api/banners endpoint...');
    const bannersResponse = await fetch('http://localhost:3000/api/banners');
    const bannersData = await bannersResponse.json();
    console.log(`   Status: ${bannersResponse.status}`);
    console.log(`   Success: ${bannersData.success}`);
    console.log(`   Banners count: ${bannersData.count}`);
    if (bannersData.banners && bannersData.banners.length > 0) {
      console.log(`   First banner: ${bannersData.banners[0].title?.en || bannersData.banners[0].title}`);
      console.log(`   First banner image: ${bannersData.banners[0].image_desktop}`);
    }
    console.log('');
  } catch (error) {
    console.log(`   Error testing banners API: ${error.message}\n`);
  }
  
  // Test categories API
  try {
    console.log('3. Testing /api/categories endpoint...');
    const categoriesResponse = await fetch('http://localhost:3000/api/categories');
    const categoriesData = await categoriesResponse.json();
    console.log(`   Status: ${categoriesResponse.status}`);
    console.log(`   Success: ${categoriesData.success}`);
    console.log(`   Categories count: ${categoriesData.count}`);
    if (categoriesData.categories && categoriesData.categories.length > 0) {
      console.log(`   First category: ${categoriesData.categories[0].name?.en || categoriesData.categories[0].name}`);
      console.log(`   First category image: ${categoriesData.categories[0].image}`);
    }
    console.log('');
  } catch (error) {
    console.log(`   Error testing categories API: ${error.message}\n`);
  }
}

// Run the tests
testApiEndpoints();