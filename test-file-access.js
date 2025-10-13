const fs = require('fs');

// Test if we can read the source file
const sourcePath = '..\\public\\images\\logo\\lettex-logo.png';

console.log('Testing file access...');

try {
  // Check if file exists
  if (fs.existsSync(sourcePath)) {
    console.log('Source file exists');
    
    // Get file stats
    const stats = fs.statSync(sourcePath);
    console.log(`Source file size: ${stats.size} bytes`);
    
    // Try to read file
    const data = fs.readFileSync(sourcePath);
    console.log(`Successfully read ${data.length} bytes from source file`);
  } else {
    console.log('Source file does not exist');
  }
} catch (error) {
  console.error('Error accessing source file:', error.message);
}