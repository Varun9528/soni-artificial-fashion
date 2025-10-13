const fs = require('fs');

console.log('Starting logo copy operation...');

// Define paths
const sourcePath = '..\\public\\images\\logo\\lettex-logo.png';
const destPath = 'public\\images\\logo\\lettex-logo.png';

console.log('Source path:', sourcePath);
console.log('Destination path:', destPath);

try {
  // Check if source file exists
  if (fs.existsSync(sourcePath)) {
    console.log('Source file exists');
    
    // Get file stats
    const stats = fs.statSync(sourcePath);
    console.log(`Source file size: ${stats.size} bytes`);
    
    // Read the source file
    const data = fs.readFileSync(sourcePath);
    console.log(`Read ${data.length} bytes from source file`);
    
    // Write to destination
    fs.writeFileSync(destPath, data);
    console.log('File written to destination');
    
    // Verify the copy
    const destStats = fs.statSync(destPath);
    console.log(`Destination file size: ${destStats.size} bytes`);
    
    if (destStats.size === stats.size) {
      console.log('✅ Logo file copied successfully!');
    } else {
      console.log('⚠️  File sizes do not match');
    }
  } else {
    console.log('❌ Source file does not exist');
  }
} catch (error) {
  console.error('Error during copy operation:', error.message);
}