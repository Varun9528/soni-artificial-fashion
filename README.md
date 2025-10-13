# Pachmarhi Tribal Art Marketplace

A fully functional e-commerce platform for authentic tribal art and handicrafts from Pachmarhi, India.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

```
src/
├── app/              # Next.js app router pages
├── components/       # React components
├── context/          # React context providers
├── data/             # Static data files
├── lib/              # Utility libraries
└── types/            # TypeScript types
```

## 🎨 Features

- **Authentication**: Secure user registration/login with JWT and hashed passwords
- **Product Management**: Browse, search, and filter authentic tribal art products
- **Shopping Cart**: Add/remove items, update quantities
- **Wishlist**: Save items for later
- **Checkout**: Secure order placement with test payment integration
- **Admin Panel**: Full CRUD operations for products, categories, orders
- **Responsive Design**: Mobile-friendly Flipkart-style UI with Tailwind CSS
- **Multi-language**: English/Hindi language toggle
- **Dark Mode**: Light/dark theme support

## 🔧 Environment Variables

Create a `.env.local` file with the following variables:

```env
# Database
DATABASE_URL="mysql://root:@localhost:3306/pachmarhi_db"

# JWT Secret - CHANGE THIS IN PRODUCTION
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Next.js
NEXT_PUBLIC_APP_NAME="Pachmarhi Tribal Art Marketplace"
NEXT_PUBLIC_APP_DESCRIPTION="Discover authentic tribal art and handicrafts from Pachmarhi"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Payment Gateway (for development only)
RAZORPAY_KEY_ID="rzp_test_your_key_here"
RAZORPAY_SECRET="your_razorpay_secret_here"
```

## 🚢 Deployment

### Version Control

This project uses Git for version control. All changes should be committed to the repository:

```bash
git add .
git commit -m "Description of changes"
git push origin main
```

### Version Management

The project uses semantic versioning (MAJOR.MINOR.PATCH):

- **Patch version**: `npm run version:patch` - Bug fixes
- **Minor version**: `npm run version:minor` - New features (backward compatible)
- **Major version**: `npm run version:major` - Breaking changes

### Deployment Process

1. Increment version:
```bash
# For bug fixes
npm run version:patch

# For new features
npm run version:minor

# For breaking changes
npm run version:major
```

2. Deploy to production:
```bash
npm run deploy
```

### Hostinger Deployment

See [DEPLOYMENT-HOSTINGER.md](DEPLOYMENT-HOSTINGER.md) for detailed deployment instructions.

## 🛠️ Development

### Prerequisites

- Node.js (version 18 or higher)
- MySQL database
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```
Then edit `.env.local` with your configuration.

4. Set up the database:
```bash
npm run db:setup
npm run db:migrate
npm run db:seed
```

### Running the Application

```bash
# Development mode
npm run dev

# Production build
npm run build
npm run start
```

## 📱 Admin Panel

Access the admin panel at `/admin` with the following credentials:

- **Email**: admin@pachmarhi.com
- **Password**: admin123

User credentials for testing:
- **Email**: user@pachmarhi.com
- **Password**: user123

Admin features include:
- Product management
- Order management
- Category management
- Artisan management
- Banner management
- Analytics dashboard

## 🧪 Testing

Run tests with:

```bash
npm run test
```

Or run the verification test:

```bash
node final_test.js
```

## 📚 Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs/)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, please contact the development team or check the documentation.

## 🚀 Quick Start (Updated)

### Automated Setup
```bash
# Run complete setup
node scripts/complete-setup.js

# Start development with database
npm run dev:setup
```

### Manual Setup
```bash
# 1. Install dependencies
npm install --legacy-peer-deps

# 2. Set up environment
cp .env.local.example .env.local
# Edit .env.local with your settings

# 3. Set up database
npm run db:reset

# 4. Start development
npm run dev
```

## 🧪 Testing

### Quick Tests
```bash
# Test authentication
npm run test:auth

# Test search
npm run test:search

# Check system health
npm run health:check
```

### Manual Testing
See TESTING_CHECKLIST.md for comprehensive testing guide.

### Status Dashboard
Visit http://localhost:3000/admin/production-ready for real-time system status.

## 🔧 Available Scripts

### Development
- `npm run dev` - Start development server
- `npm run dev:setup` - Complete setup + start dev
- `npm run dev:clean` - Clean build + start dev

### Database
- `npm run db:setup` - Create database
- `npm run db:migrate` - Apply schema
- `npm run db:seed` - Load sample data
- `npm run db:reset` - Complete database reset

### Health Monitoring
- `npm run health:check` - Check all systems
- `npm run health:database` - Check database
- `npm run health:admin` - Check admin access

### Testing
- `npm run test:auth` - Test authentication
- `npm run test:search` - Test search API
- `npm run test:payment` - Test payment API

### Production
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run build:production` - Build + start production

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
| Health Monitoring | ✅ Working | Real-time status dashboard |

## 🚀 Quick Start (Updated)

### Automated Setup
```bash
# Run complete setup
node scripts/complete-setup.js

# Start development with database
npm run dev:setup
```

### Manual Setup
```bash
# 1. Install dependencies
npm install --legacy-peer-deps

# 2. Set up environment
cp .env.local.example .env.local
# Edit .env.local with your settings

# 3. Set up database
npm run db:reset

# 4. Start development
npm run dev
```

## 🧪 Testing

### Quick Tests
```bash
# Test authentication
npm run test:auth

# Test search
npm run test:search

# Check system health
npm run health:check
```

### Manual Testing
See TESTING_CHECKLIST.md for comprehensive testing guide.

### Status Dashboard
Visit http://localhost:3000/admin/production-ready for real-time system status.

## 🔧 Available Scripts

### Development
- `npm run dev` - Start development server
- `npm run dev:setup` - Complete setup + start dev
- `npm run dev:clean` - Clean build + start dev

### Database
- `npm run db:setup` - Create database
- `npm run db:migrate` - Apply schema
- `npm run db:seed` - Load sample data
- `npm run db:reset` - Complete database reset

### Health Monitoring
- `npm run health:check` - Check all systems
- `npm run health:database` - Check database
- `npm run health:admin` - Check admin access

### Testing
- `npm run test:auth` - Test authentication
- `npm run test:search` - Test search API
- `npm run test:payment` - Test payment API

### Production
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run build:production` - Build + start production

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
| Health Monitoring | ✅ Working | Real-time status dashboard |