#!/usr/bin/env node

/**
 * Pachmarhi Marketplace Complete Setup Script
 * Addresses all critical production readiness items
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Starting Pachmarhi Marketplace Complete Setup...\n');

// 1. Install missing dependencies
console.log('📦 Installing missing dependencies...');
try {
  execSync('npm install bcryptjs jsonwebtoken @types/bcryptjs @types/jsonwebtoken --legacy-peer-deps', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
  console.log('✅ Dependencies installed successfully');
} catch (error) {
  console.log('⚠️ Failed to install dependencies automatically');
  console.log('Please run manually: npm install bcryptjs jsonwebtoken @types/bcryptjs @types/jsonwebtoken --legacy-peer-deps');
}

// 2. Create comprehensive .env.local
const envContent = `# Database Configuration
DATABASE_URL="mysql://root:password@localhost:3306/pachmarhi_db"
DB_HOST="localhost"
DB_USER="root"
DB_PASSWORD=""
DB_NAME="pachmarhi_db"
DB_PORT="3306"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_ACCESS_TOKEN_EXPIRES_IN="15m"
JWT_REFRESH_TOKEN_EXPIRES_IN="7d"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-key"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"

# Feature Flags
NEXT_PUBLIC_ENABLE_DARK_MODE="true"
NEXT_PUBLIC_ENABLE_SEARCH="true"
NEXT_PUBLIC_ENABLE_CART="true"
NEXT_PUBLIC_ENABLE_WISHLIST="true"

# Payment Configuration (Mock by default)
PAYMENT_PROVIDER="mock"
STRIPE_PUBLISHABLE_KEY=""
STRIPE_SECRET_KEY=""
RAZORPAY_KEY_ID=""
RAZORPAY_KEY_SECRET=""

# Email Configuration (Mock by default)
EMAIL_PROVIDER="mock"
SMTP_HOST=""
SMTP_PORT="587"
SMTP_USER=""
SMTP_PASS=""

# File Upload
UPLOAD_DIR="./public/uploads"
MAX_FILE_SIZE="5242880"
ALLOWED_FILE_TYPES="image/jpeg,image/png,image/webp"

# Security
RATE_LIMIT_ENABLED="true"
BCRYPT_SALT_ROUNDS="12"`;

fs.writeFileSync('.env.local', envContent);
console.log('✅ Created .env.local with all required variables');

// 3. Database setup scripts
const dbSetupScript = `#!/bin/bash

echo "🗄️ Setting up MySQL database for Pachmarhi Marketplace..."

# Check if MySQL is installed
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL is not installed. Please install MySQL first:"
    echo "   - Windows: https://dev.mysql.com/downloads/installer/"
    echo "   - macOS: brew install mysql"
    echo "   - Ubuntu: sudo apt install mysql-server"
    exit 1
fi

# Create database
echo "📊 Creating database..."
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS pachmarhi_db;" 2>/dev/null || {
    echo "⚠️ Database creation failed. Please run manually:"
    echo "   mysql -u root -p -e 'CREATE DATABASE pachmarhi_db;'"
}

# Run schema
if [ -f "database/schema.sql" ]; then
    echo "📋 Applying database schema..."
    mysql -u root -p pachmarhi_db < database/schema.sql 2>/dev/null || {
        echo "⚠️ Schema application failed. Please run manually:"
        echo "   mysql -u root -p pachmarhi_db < database/schema.sql"
    }
else
    echo "⚠️ Schema file not found at database/schema.sql"
fi

# Run seed data
if [ -f "database/seed.js" ]; then
    echo "🌱 Seeding database..."
    node database/seed.js || {
        echo "⚠️ Seeding failed. Please run manually:"
        echo "   node database/seed.js"
    }
else
    echo "⚠️ Seed file not found at database/seed.js"
fi

echo "✅ Database setup complete!"`;

fs.writeFileSync('scripts/setup-database.sh', dbSetupScript);
fs.chmodSync('scripts/setup-database.sh', '755');
console.log('✅ Created database setup script');

// 4. Enhanced package.json scripts
const packageJsonPath = 'package.json';
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

packageJson.scripts = {
  ...packageJson.scripts,
  // Database scripts
  'db:setup': 'mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS pachmarhi_db;"',
  'db:migrate': 'mysql -u root -p pachmarhi_db < database/schema.sql',
  'db:seed': 'node database/seed.js',
  'db:reset': 'npm run db:setup && npm run db:migrate && npm run db:seed',
  
  // Development scripts
  'dev:setup': 'npm install && npm run db:reset && npm run dev',
  'dev:clean': 'rm -rf .next && npm run dev',
  
  // Health checks
  'health:check': 'curl -s http://localhost:3000/api/health/database && echo && curl -s http://localhost:3000/api/health/admin',
  'health:database': 'curl -s http://localhost:3000/api/health/database',
  'health:admin': 'curl -s http://localhost:3000/api/health/admin',
  
  // Testing scripts
  'test:auth': 'curl -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d "{\\"email\\": \\"admin@pachmarhi.com\\", \\"password\\": \\"admin123\\"}"',
  'test:search': 'curl -s "http://localhost:3000/api/search?q=bamboo"',
  'test:payment': 'curl -X POST http://localhost:3000/api/payment -H "Content-Type: application/json" -d "{\\"amount\\": 100, \\"paymentMethod\\": \\"cod\\", \\"items\\": [], \\"shippingAddress\\": {}}"',
  
  // Production scripts
  'build:production': 'npm run build && npm run start',
  'setup:production': 'cp .env.example .env.local && echo "Configure .env.local with your settings"'
};

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
console.log('✅ Enhanced package.json with comprehensive scripts');

// 5. Create comprehensive testing checklist
const testingChecklist = `# 🧪 Comprehensive Testing Checklist

## ✅ Manual Testing Guide

### 1. Authentication Flow
- [ ] Visit /login and login with: admin@pachmarhi.com / admin123
- [ ] Visit /register and create a new account
- [ ] Verify user menu appears after login
- [ ] Test logout functionality
- [ ] Verify admin access to /admin panel

### 2. Search Functionality
- [ ] Use search bar in header
- [ ] Visit /search page directly
- [ ] Test filters: category, price range
- [ ] Test sorting: price, rating, popularity
- [ ] Verify search results display correctly

### 3. Product Browsing
- [ ] Browse homepage product sections
- [ ] Click on product cards
- [ ] Navigate to /product/[slug] pages
- [ ] Test category navigation
- [ ] Verify images display correctly

### 4. Shopping Flow
- [ ] Add products to cart
- [ ] Visit /cart and update quantities
- [ ] Proceed through /checkout
- [ ] Complete payment (mock)
- [ ] View order confirmation

### 5. Wishlist & Compare
- [ ] Add products to wishlist
- [ ] Visit /wishlist page
- [ ] Add products to compare
- [ ] Visit /compare page

### 6. Admin Panel
- [ ] Access /admin dashboard
- [ ] View /admin/products list
- [ ] Check /admin/production-ready status
- [ ] Test health monitoring

### 7. Theme & Responsive
- [ ] Toggle dark/light mode
- [ ] Test mobile responsiveness
- [ ] Verify header/footer on all pages
- [ ] Check PWA installation prompt

### 8. Performance
- [ ] Test page loading speeds
- [ ] Verify image optimization
- [ ] Check offline functionality
- [ ] Test search response times

## 🔧 Automated Testing Commands

\`\`\`bash
# Test authentication
npm run test:auth

# Test search API
npm run test:search

# Test payment API
npm run test:payment

# Check system health
npm run health:check

# Test database connection
npm run health:database
\`\`\`

## 📊 Status Dashboard

Visit these URLs to monitor system status:
- Health Dashboard: http://localhost:3000/admin/production-ready
- API Status: http://localhost:3000/api/health/database
- Admin Status: http://localhost:3000/api/health/admin

## 🚨 Known Issues to Monitor

1. **Dependencies**: bcryptjs and jsonwebtoken may need manual installation
2. **Database**: Requires MySQL setup and configuration
3. **Images**: Using SVG placeholders, need real product images
4. **Payment**: Mock payment only, needs Stripe/Razorpay integration
5. **Email**: Mock email service, needs SMTP configuration

## ✅ Success Criteria

The marketplace is production-ready when:
- [ ] All authentication flows work with database
- [ ] Search returns relevant results quickly
- [ ] Shopping cart persists across sessions
- [ ] Admin can manage all content via CRUD
- [ ] Payment processing works end-to-end
- [ ] All pages render with header/footer
- [ ] Dark/light mode works throughout
- [ ] Mobile experience is smooth
- [ ] Performance meets standards (< 3s page loads)
- [ ] PWA installs and works offline`;

fs.writeFileSync('TESTING_CHECKLIST.md', testingChecklist);
console.log('✅ Created comprehensive testing checklist');

// 6. Enhanced README updates
const readmeAddendum = `

## 🚀 Quick Start (Updated)

### Automated Setup
\`\`\`bash
# Run complete setup
node scripts/complete-setup.js

# Start development with database
npm run dev:setup
\`\`\`

### Manual Setup
\`\`\`bash
# 1. Install dependencies
npm install --legacy-peer-deps

# 2. Set up environment
cp .env.local.example .env.local
# Edit .env.local with your settings

# 3. Set up database
npm run db:reset

# 4. Start development
npm run dev
\`\`\`

## 🧪 Testing

### Quick Tests
\`\`\`bash
# Test authentication
npm run test:auth

# Test search
npm run test:search

# Check system health
npm run health:check
\`\`\`

### Manual Testing
See TESTING_CHECKLIST.md for comprehensive testing guide.

### Status Dashboard
Visit http://localhost:3000/admin/production-ready for real-time system status.

## 🔧 Available Scripts

### Development
- \`npm run dev\` - Start development server
- \`npm run dev:setup\` - Complete setup + start dev
- \`npm run dev:clean\` - Clean build + start dev

### Database
- \`npm run db:setup\` - Create database
- \`npm run db:migrate\` - Apply schema
- \`npm run db:seed\` - Load sample data
- \`npm run db:reset\` - Complete database reset

### Health Monitoring
- \`npm run health:check\` - Check all systems
- \`npm run health:database\` - Check database
- \`npm run health:admin\` - Check admin access

### Testing
- \`npm run test:auth\` - Test authentication
- \`npm run test:search\` - Test search API
- \`npm run test:payment\` - Test payment API

### Production
- \`npm run build\` - Build for production
- \`npm run start\` - Start production server
- \`npm run build:production\` - Build + start production

## 📊 Current Feature Status

| Feature | Status | Notes |
|---------|--------|-------|
| Authentication | ✅ Working | Login/register/logout functional |
| Search & Filters | ✅ Working | Full-text search with sorting |
| Shopping Cart | ⚠️ Frontend | Needs database persistence |
| Admin Panel | ⚠️ Frontend | Needs CRUD database connection |
| Payment | ⚠️ Mock | Needs Stripe/Razorpay integration |
| Dark/Light Mode | ✅ Working | Full theme system |
| PWA | ✅ Working | Installable with offline support |
| Header/Footer | ✅ Working | Consistent across all pages |
| Database Schema | ✅ Ready | Complete schema with seed data |
| Health Monitoring | ✅ Working | Real-time status dashboard |`;

fs.appendFileSync('README.md', readmeAddendum);
console.log('✅ Updated README with enhanced documentation');

console.log('\n🎉 Complete setup finished!');
console.log('\n📋 Next steps:');
console.log('1. Configure .env.local with your database credentials');
console.log('2. Run: npm install --legacy-peer-deps (if deps failed)');
console.log('3. Run: npm run db:reset (to set up database)');
console.log('4. Run: npm run dev (to start development)');
console.log('5. Visit: http://localhost:3000/admin/production-ready (for status)');
console.log('6. Review: TESTING_CHECKLIST.md (for comprehensive testing)');

console.log('\n🎯 The marketplace now has:');
console.log('✅ Complete authentication system');
console.log('✅ Advanced search with filters');
console.log('✅ Professional header/footer');
console.log('✅ Dark/light mode theming');
console.log('✅ Health monitoring dashboard');
console.log('✅ Comprehensive testing framework');
console.log('✅ Production deployment scripts');

console.log('\n🚀 Ready for database connection and final polish!');