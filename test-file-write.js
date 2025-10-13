const fs = require('fs');

console.log('Testing file write operation...');

try {
  // Write test content to a new file
  const testContent = 'This is test content';
  fs.writeFileSync('test-write.txt', testContent);
  console.log('Test content written successfully');
  
  // Verify the write
  const readContent = fs.readFileSync('test-write.txt', 'utf8');
  console.log('Read content:', readContent);
  
  if (readContent === testContent) {
    console.log('✅ File write operation successful!');
  } else {
    console.log('❌ File write operation failed');
  }
} catch (error) {
  console.error('Error during file write test:', error.message);
}