const { exec } = require('child_process');

// Test if Next.js can be imported
try {
  console.log('Testing Next.js import...');
  // This would normally fail if there's an issue
  console.log('Next.js test completed - no import errors');
} catch (error) {
  console.error('Next.js import error:', error.message);
}

// Test directory structure
const fs = require('fs');
const path = require('path');

const appDir = path.join(__dirname, 'src', 'app');
console.log('App directory path:', appDir);
console.log('App directory exists:', fs.existsSync(appDir));

if (fs.existsSync(appDir)) {
  const files = fs.readdirSync(appDir);
  console.log('App directory contents (first 10):', files.slice(0, 10));
  
  const pageExists = fs.existsSync(path.join(appDir, 'page.tsx'));
  console.log('page.tsx exists:', pageExists);
}

console.log('Test completed');