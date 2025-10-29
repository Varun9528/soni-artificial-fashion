const { exec } = require('child_process');
const path = require('path');

console.log('Starting deployment process...');

// Build the Next.js application
console.log('Building the application...');
exec('npm run build', { cwd: path.join(__dirname) }, (error, stdout, stderr) => {
  if (error) {
    console.error(`Build error: ${error}`);
    return;
  }
  
  console.log('Build completed successfully!');
  console.log('Deployment process completed!');
  console.log('The updated version is now ready to be deployed.');
});