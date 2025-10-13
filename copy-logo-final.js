const fs = require('fs');
const path = require('path');

// Define source and destination paths
const sourcePath = path.join('..', 'public', 'images', 'logo', 'lettex logo.png');
const destPath = path.join('public', 'images', 'logo', 'lettex-logo.png');

console.log('Source path:', sourcePath);
console.log('Destination path:', destPath);

// Check if source file exists
if (fs.existsSync(sourcePath)) {
  console.log('Source file exists');
  
  // Copy file
  try {
    fs.copyFileSync(sourcePath, destPath);
    console.log('Logo file copied successfully!');
  } catch (error) {
    console.error('Error copying file:', error.message);
  }
} else {
  console.log('Source file does not exist');
  
  // Try alternative approach - check if file exists with different name
  const altSourcePath = path.join('public', 'images', 'logo', 'lettex logo.png');
  console.log('Trying alternative source path:', altSourcePath);
  
  if (fs.existsSync(altSourcePath)) {
    console.log('Alternative source file exists');
    try {
      fs.copyFileSync(altSourcePath, destPath);
      console.log('Logo file copied successfully from alternative path!');
    } catch (error) {
      console.error('Error copying file from alternative path:', error.message);
    }
  } else {
    console.log('Alternative source file also does not exist');
  }
}