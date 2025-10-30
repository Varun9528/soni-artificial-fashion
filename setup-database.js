#!/usr/bin/env node

console.log(`
=====================================
DATABASE SETUP INSTRUCTIONS
=====================================

To get your products and banners showing on your website, you need to:

1. CREATE A PLANETSCALE DATABASE:
   - Go to https://planetscale.com/
   - Sign up for a free account
   - Create a new database named "soni-artificial-fashion"
   - Click on your database, then "Connect"
   - Select "Prisma" or "MySQL" connection method
   - Copy the connection details

2. ADD THESE ENVIRONMENT VARIABLES TO VERCEL:
   Run these commands in your terminal:
   
   cd c:\\xampp\\htdocs\\pachmarhi\\soni-artificial-fashion
   
   vercel env add DB_HOST
   # Enter your database host (e.g., aws.connect.psdb.cloud)
   
   vercel env add DB_USER
   # Enter your database username
   
   vercel env add DB_PASSWORD
   # Enter your database password (will be hidden)
   
   vercel env add DB_NAME
   # Enter your database name (soni-artificial-fashion)
   
   vercel env add DB_PORT
   # Enter 3306

3. AFTER SETTING ENVIRONMENT VARIABLES, DEPLOY AGAIN:
   vercel --prod --yes

4. SEED YOUR DATABASE:
   You can do this by:
   - Connecting to your database with a MySQL client and running the schema
   - Or temporarily running from your local machine:
     npx prisma db push
     npx prisma db seed

This will make your products and banners visible on your website.
`);