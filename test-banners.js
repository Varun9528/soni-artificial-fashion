// First, let's login as admin to get a token
async function loginAsAdmin() {
  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@soniartificialfashion.com',
        password: 'admin123'
      }),
    });
    
    const result = await response.json();
    console.log('Login result:', result);
    
    if (result.token) {
      console.log('Got admin token:', result.token);
      return result.token;
    } else {
      console.error('Failed to login as admin');
      return null;
    }
  } catch (error) {
    console.error('Error logging in:', error);
    return null;
  }
}

// Function to add a banner
async function addBanner(token, bannerData) {
  try {
    const response = await fetch('http://localhost:3000/api/admin/banners', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(bannerData),
    });
    
    const result = await response.json();
    console.log('Banner creation result:', result);
    return result;
  } catch (error) {
    console.error('Error adding banner:', error);
  }
}

// Banner data
const banners = [
  {
    title: { en: 'Summer Collection', hi: 'ग्रीष्मकालीन संग्रह' },
    subtitle: { en: 'Discover our new arrivals', hi: 'हमारे नए आगमन की खोज करें' },
    image: '/images/banner/banner1.png',
    link: '/collections/summer',
    buttonText: { en: 'Shop Now', hi: 'अभी खरीदें' },
    type: 'HERO',
    isActive: true,
    sortOrder: 1
  },
  {
    title: { en: 'Handcrafted Artisans', hi: 'हस्तनिर्मित कलाकार' },
    subtitle: { en: 'Support local artisans', hi: 'स्थानीय कलाकारों का समर्थन करें' },
    image: '/images/banner/banner2.png',
    link: '/artisans',
    buttonText: { en: 'Explore', hi: 'अन्वेषण करें' },
    type: 'HERO',
    isActive: true,
    sortOrder: 2
  },
  {
    title: { en: 'Festival Sale', hi: 'त्योहार बिक्री' },
    subtitle: { en: 'Up to 50% off on selected items', hi: 'चयनित वस्तुओं पर 50% तक की छूट' },
    image: '/images/banner/banner3.png',
    link: '/sale',
    buttonText: { en: 'Grab Deal', hi: 'सौदा पकड़ो' },
    type: 'HERO',
    isActive: true,
    sortOrder: 3
  }
];

// Add all banners
async function addAllBanners() {
  console.log('Logging in as admin...');
  const token = await loginAsAdmin();
  
  if (!token) {
    console.error('Cannot proceed without admin token');
    return;
  }
  
  for (let i = 0; i < banners.length; i++) {
    console.log(`Adding banner ${i + 1}...`);
    await addBanner(token, banners[i]);
  }
  console.log('All banners added!');
}

// Run the function
addAllBanners();