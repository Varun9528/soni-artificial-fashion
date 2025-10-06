#!/bin/bash

# Pachmarhi Marketplace Production Deployment Script
echo "🚀 Starting Pachmarhi Marketplace Production Deployment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if Prisma is properly installed
if ! npx prisma --version &> /dev/null; then
    echo "🔧 Installing Prisma CLI..."
    npm install prisma @prisma/client ts-node
fi

# Generate Prisma client
echo "🗄️ Generating Prisma client..."
npx prisma generate

# Set up database
echo "🗄️ Setting up database..."
npx prisma db push

# Seed database
echo "🌱 Seeding database..."
npx ts-node prisma/seed.ts

# Build application
echo "🏗️ Building application..."
npm run build

# Create production environment file if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating production environment file..."
    cp .env.example .env.local
    echo "⚠️ Please update .env.local with your production settings"
fi

echo "✅ Deployment completed successfully!"
echo ""
echo "🎯 Next steps:"
echo "1. Update .env.local with your production database URL and secrets"
echo "2. Configure your production domain and SSL certificates"
echo "3. Set up your payment gateway (Razorpay/Stripe) credentials"
echo "4. Configure email service (SMTP) settings"
echo "5. Set up image upload service (Cloudinary/AWS S3)"
echo ""
echo "🚀 To start the production server:"
echo "npm run start"
echo ""
echo "📊 To access the admin panel:"
echo "URL: http://localhost:3000/admin"
echo "Email: admin@pachmarhi.com"
echo "Password: admin123"
echo ""
echo "👤 To test with demo user:"
echo "Email: user@pachmarhi.com"
echo "Password: user123"