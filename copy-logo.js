const fs = require('fs');

// Source and destination paths
const source = 'c:\\Users\\hp\\Desktop\\pachmarhi\\public\\images\\logo\\lettex logo.png';
const destination = 'c:\\Users\\hp\\Desktop\\pachmarhi\\pachmarhi-marketplace\\public\\images\\logo\\lettex-logo.png';

// Copy file
fs.copyFileSync(source, destination);
console.log('Logo file copied successfully!');