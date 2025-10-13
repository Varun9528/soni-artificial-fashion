const fs = require('fs');
const path = require('path');

// Source and destination paths
const source = path.join(__dirname, '..', 'public', 'images', 'logo', 'lettex-logo.png');
const destination = path.join(__dirname, 'public', 'images', 'logo', 'lettex-logo.png');

console.log('Source:', source);
console.log('Destination:', destination);

// Check if source file exists
if (fs.existsSync(source)) {
  console.log('Source file exists');
  
  // Copy file
  fs.copyFileSync(source, destination);
  console.log('Logo file copied successfully!');
} else {
  console.log('Source file does not exist');
  
  // Try alternative source path
  const altSource = 'c:\\Users\\hp\\Desktop\\pachmarhi\\public\\images\\logo\\lettex logo.png';
  console.log('Trying alternative source:', altSource);
  
  if (fs.existsSync(altSource)) {
    // Rename the file during copy
    const destPath = path.join(__dirname, 'public', 'images', 'logo', 'lettex-logo.png');
    fs.copyFileSync(altSource, destPath);
    console.log('Logo file copied and renamed successfully!');
  } else {
    console.log('Alternative source file also does not exist');
  }
}