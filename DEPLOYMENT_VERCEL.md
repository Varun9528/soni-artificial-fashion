# Lettex Marketplace - Vercel Deployment Guide

This guide will walk you through deploying your Lettex Marketplace to Vercel.

## Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. The Lettex Marketplace project code
3. A MySQL database (can be hosted on platforms like PlanetScale, Railway, or any cloud provider)

## Step-by-Step Deployment Instructions

### 1. Prepare Your Project

Before deploying, ensure your project is ready:

1. **Verify the build works locally:**
   ```bash
   npm run build
   ```

2. **Test the production build:**
   ```bash
   npm run start
   ```

### 2. Set Up Your Database

Vercel is a serverless platform, so you'll need an external MySQL database:

1. **Options for hosting your MySQL database:**
   - [PlanetScale](https://planetscale.com/) (recommended for serverless)
   - [Railway](https://railway.app/)
   - [Supabase](https://supabase.com/)
   - Any cloud MySQL provider (AWS RDS, Google Cloud SQL, etc.)

2. **Set up your database:**
   - Create a new MySQL database
   - Note down the connection details:
     - Host
     - Port
     - Database name
     - Username
     - Password

3. **Apply the database schema:**
   You can use the SQL schema from the project:
   ```bash
   # If you have direct access to your database
   mysql -h YOUR_HOST -u YOUR_USER -p YOUR_DATABASE < database/schema.sql
   ```

### 3. Configure Environment Variables

Create a `.env.production` file with your production environment variables:

```env
# Database Configuration
DATABASE_URL="mysql://USERNAME:PASSWORD@HOST:PORT/DATABASE_NAME"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_ACCESS_TOKEN_EXPIRES_IN="15m"
JWT_REFRESH_TOKEN_EXPIRES_IN="7d"

# NextAuth Configuration
NEXTAUTH_URL="https://your-vercel-url.vercel.app"
NEXTAUTH_SECRET="your-nextauth-secret-key"

# App Configuration
NEXT_PUBLIC_APP_URL="https://your-vercel-url.vercel.app"
NODE_ENV="production"

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
BCRYPT_SALT_ROUNDS="12"
```

### 4. Deploy to Vercel Using Git Integration (Recommended)

1. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit for Lettex Marketplace"
   git branch -M main
   git remote add origin https://github.com/your-username/lettex-marketplace.git
   git push -u origin main
   ```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign in to your account
   - Click "New Project"
   - Import your GitHub repository
   - Configure the project:
     - Framework Preset: Next.js
     - Root Directory: ./
     - Build Command: `npm run build`
     - Output Directory: .next

3. **Add Environment Variables in Vercel:**
   In your Vercel project dashboard:
   - Go to Settings > Environment Variables
   - Add all the environment variables from your `.env.production` file
   - Make sure to set the environment to "Production" for production variables

4. **Deploy:**
   - Click "Deploy"
   - Vercel will automatically build and deploy your application

### 5. Alternative: Deploy Using Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Log in to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy your project:**
   ```bash
   vercel
   ```
   
   Follow the prompts:
   - Set up and deploy? Yes
   - Which scope? Select your personal account or team
   - Link to existing project? No (for first deployment)
   - What's your project's name? lettex-marketplace
   - In which directory is your code located? ./

4. **Add environment variables:**
   ```bash
   vercel env add DATABASE_URL
   vercel env add JWT_SECRET
   # Add all other required environment variables
   ```

5. **Deploy to production:**
   ```bash
   vercel --prod
   ```

### 6. Post-Deployment Steps

1. **Seed Initial Data (Optional):**
   If you want to add sample products and categories:
   ```bash
   # Run this from your local machine, connecting to your production database
   npm run db:seed
   ```

2. **Test Your Deployment:**
   - Visit your deployed URL
   - Test all functionality:
     - Navigation between pages
     - Product browsing
     - Search functionality
     - Language toggle
     - Add to cart functionality
     - Admin panel access

3. **Set up Custom Domain (Optional):**
   - In your Vercel dashboard, go to Settings > Domains
   - Add your custom domain
   - Follow the DNS configuration instructions

### 7. Environment Variables Reference

Here are the key environment variables you need to configure in Vercel:

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Connection string for your MySQL database | `mysql://user:pass@host:port/db` |
| `JWT_SECRET` | Secret key for JWT token signing | `your-super-secret-jwt-key` |
| `NEXTAUTH_SECRET` | Secret for NextAuth.js | `your-nextauth-secret-key` |
| `NEXTAUTH_URL` | URL of your deployed application | `https://your-app.vercel.app` |
| `NEXT_PUBLIC_APP_URL` | Public URL of your application | `https://your-app.vercel.app` |

### 8. Troubleshooting Common Issues

1. **Database Connection Issues:**
   - Ensure your database allows connections from Vercel's IP addresses
   - Verify your DATABASE_URL is correct
   - Check if your database provider requires whitelisting IPs

2. **Environment Variables Not Set:**
   - Double-check that all required environment variables are added in Vercel
   - Ensure they are assigned to the correct environments (Development, Preview, Production)

3. **Build Failures:**
   - Check the build logs in Vercel for specific error messages
   - Ensure all dependencies are correctly listed in package.json
   - Verify that your build command is `npm run build`

4. **Image Optimization Issues:**
   - Check your `next.config.js` file for proper image configuration
   - Ensure your image domains are correctly configured

### 9. Monitoring and Maintenance

1. **Monitor Deployments:**
   - Use Vercel's dashboard to monitor deployments and logs
   - Set up alerts for failed deployments

2. **Update Your Application:**
   To deploy new changes:
   ```bash
   git add .
   git commit -m "Description of changes"
   git push origin main
   ```
   Vercel will automatically deploy new commits to the main branch.

3. **Rollback (if needed):**
   - In Vercel dashboard, go to your project
   - Click on "Deployments"
   - Find a previous successful deployment
   - Click the three dots menu and select "Rollback"

## Conclusion

Your Lettex Marketplace is now ready to be deployed to Vercel! The platform will automatically handle scaling, CDN distribution, and SSL certificates for you.

Remember to:
1. Keep your environment variables secure
2. Regularly backup your database
3. Monitor your application's performance
4. Update your application as needed

If you encounter any issues during deployment, check Vercel's documentation or reach out to their support team.