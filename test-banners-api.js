// Test the banners API directly
require('dotenv').config({ path: '.env.production' });

const http = require('http');

// Create a simple server to test the banners API
const server = http.createServer(async (req, res) => {
  if (req.url === '/api/banners' && req.method === 'GET') {
    try {
      // Import and test the database function directly
      const { serverDb } = await import('./src/lib/database/server-db.js');
      
      const banners = await serverDb.getAllBanners();
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        success: true, 
        banners,
        count: banners.length
      }));
    } catch (error) {
      console.error('Error:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        success: false, 
        error: error.message 
      }));
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

server.listen(3001, () => {
  console.log('Test server running on port 3001');
  console.log('Visit http://localhost:3001/api/banners to test banners API');
});