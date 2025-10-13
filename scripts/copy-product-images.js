const fs = require('fs');
const path = require('path');

// Source and destination paths
const sourceDir = 'c:\\Users\\hp\\Desktop\\pachmarhi\\public\\uploads\\products';
const destDir = 'c:\\Users\\hp\\Desktop\\pachmarhi\\pachmarhi-marketplace\\public\\uploads\\products';

// Read all files from source directory
fs.readdir(sourceDir, (err, files) => {
  if (err) {
    console.error('Error reading source directory:', err);
    return;
  }

  // Create destination directory if it doesn't exist
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  // Copy each file
  files.forEach(file => {
    const sourcePath = path.join(sourceDir, file);
    const destPath = path.join(destDir, file);
    
    // Copy file
    fs.copyFileSync(sourcePath, destPath);
    console.log(`Copied ${file} to ${destPath}`);
  });

  console.log('All product images copied successfully!');
});