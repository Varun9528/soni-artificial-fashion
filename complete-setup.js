#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log(`
🚀 SONI ARTIFICIAL FASHION - COMPLETE SETUP
========================================

This script will help you set up your database so products and banners appear.

CURRENT STATUS:
❌ Database not connected
❌ Products not showing
❌ Banners not showing

`);

// Check if we're in the right directory
const requiredFiles = ['package.json', 'prisma/schema.prisma'];
const missingFiles = requiredFiles.filter(file => !fs.existsSync(path.join(process.cwd(), file)));

if (missingFiles.length > 0) {
  console.log(`❌ Error: Missing required files: ${missingFiles.join(', ')}`);
  console.log(`   Make sure you're running this from the project root directory.`);
  process.exit(1);
}

console.log(`
STEP 1: CREATE DATABASE
======================
1. Go to https://planetscale.com/
2. Sign up for FREE (GitHub or email)
3. Create database named: soni-artificial-fashion
4. Click "Connect" > "MySQL"
5. Save these details:
   - Host: _____
   - Username: _____
   - Password: _____
`);

console.log(`
STEP 2: SET ENVIRONMENT VARIABLES
===============================
Run these commands one by one:

cd c:\\xampp\\htdocs\\pachmarhi\\soni-artificial-fashion

vercel env add DB_HOST
# Enter your Host from Step 1

vercel env add DB_USER
# Enter your Username from Step 1

vercel env add DB_PASSWORD
# Enter your Password from Step 1

vercel env add DB_NAME
# Enter: soni-artificial-fashion

vercel env add DB_PORT
# Enter: 3306
`);

console.log(`
STEP 3: POPULATE DATABASE
========================
CRITICAL: This makes your products appear!

npx prisma db push
npx prisma db seed

`);

console.log(`
STEP 4: DEPLOY
=============
vercel --prod --yes

`);

console.log(`
ADMIN ACCESS
============
Email: admin@soniartificialfashion.com
Password: admin123

`);

console.log(`
TROUBLESHOOTING
==============
If products still don't show:

1. Check environment variables:
   vercel env list

2. Test database connection:
   node check-db-connection.js

3. Re-seed database:
   npx prisma db push --force-reset
   npx prisma db seed

Need help? Follow VERCEL_SETUP_INSTRUCTIONS.txt for detailed steps.
`);