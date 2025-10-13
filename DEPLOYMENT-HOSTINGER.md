# Deployment Guide for Hostinger Premium Plan

This guide will help you deploy the Pachmarhi Tribal Art Marketplace on Hostinger's Premium Shared Hosting plan.

## Prerequisites

1. Hostinger Premium Shared Hosting account
2. Node.js 18+ support (available on Premium plans)
3. SSH access enabled
4. A domain name (optional but recommended)

## Deployment Steps

### 1. Prepare Your Files

Before uploading, ensure you have the latest version of your project:

```bash
# In your local development environment
git add .
git commit -m "Final deployment version"
git push origin main
```

### 2. Build the Project Locally

```bash
# Install dependencies
npm install

# Build the project
npm run build
```

### 3. Upload Files to Hostinger

#### Option A: Using Hostinger File Manager (Easiest)

1. Log in to your Hostinger hPanel
2. Go to "Files" → "File Manager"
3. Navigate to `public_html` directory
4. Delete any existing files
5. Upload the entire project folder contents:
   - `/.next` (build output)
   - `/public` (static assets)
   - `/src` (source files)
   - All configuration files:
     - `package.json`
     - `next.config.ts`
     - `tsconfig.json`
     - `.env.production`
     - etc.

#### Option B: Using SFTP/FTP

1. Use an FTP client like FileZilla
2. Connect to your Hostinger account
3. Upload all project files to the root directory (usually `public_html`)

### 4. Set Up Environment Variables

Create a `.env.production` file in your root directory with the following content:

```env
# Database Configuration
DATABASE_URL="mysql://your_username:your_password@your_host:3306/your_database_name"

# JWT Secret (change this to a secure random string)
JWT_SECRET="your-very-secure-jwt-secret-key-change-this"

# Application Settings
NEXT_PUBLIC_APP_NAME="Pachmarhi Tribal Art Marketplace"
NEXT_PUBLIC_APP_DESCRIPTION="Discover authentic tribal art and handicrafts from Pachmarhi"
NEXT_PUBLIC_APP_URL="https://yourdomain.com"

# Payment Gateway (for production)
RAZORPAY_KEY_ID="your_production_key_id"
RAZORPAY_SECRET="your_production_secret"
```

### 5. Install Dependencies via SSH

1. In hPanel, go to "Access Details" and enable SSH
2. Connect via SSH:
   ```bash
   ssh your_username@your_hostinger_server
   ```
3. Navigate to your project directory:
   ```bash
   cd public_html
   ```
4. Install dependencies:
   ```bash
   npm install --production
   ```

### 6. Configure Node.js Application

#### Create a startup script

Create a file named `start.sh` in your root directory:

```bash
#!/bin/bash
cd /home/your_username/public_html
npm run start
```

Make it executable:
```bash
chmod +x start.sh
```

#### Set up as a service (if supported by your plan)

Create a `ecosystem.config.js` file:

```javascript
module.exports = {
  apps: [{
    name: 'pachmarhi-marketplace',
    script: 'npm',
    args: 'start',
    cwd: '/home/your_username/public_html',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
```

### 7. Configure Domain and Subdomain

1. In hPanel, go to "Domains"
2. Add your domain or subdomain
3. Point it to your `public_html` directory
4. Wait for DNS propagation (usually 24-48 hours)

### 8. Set Up Custom Node.js App (Premium Feature)

1. In hPanel, go to "Hosting" → "Custom Node.js App"
2. Click "Create Application"
3. Fill in the details:
   - Application Name: `pachmarhi-marketplace`
   - Application Root: `/home/your_username/public_html`
   - Application Startup File: `server.js` or your entry point
   - Node.js Version: 18 or higher

### 9. Database Setup

#### Option A: Use Hostinger MySQL Database

1. In hPanel, go to "Databases" → "MySQL Databases"
2. Create a new database
3. Note the database name, username, and password
4. Update your `.env.production` file with these details

#### Option B: Import Existing Database

If you have an existing database:

1. Export your local database:
   ```bash
   mysqldump -u root -p your_local_db > pachmarhi_backup.sql
   ```
2. Import to Hostinger:
   - In hPanel, go to "Databases" → "phpMyAdmin"
   - Select your database
   - Click "Import" and upload your SQL file

### 10. Run Database Migrations

Connect via SSH and run:

```bash
cd public_html
npx prisma migrate deploy
npx prisma generate
```

### 11. Set Up SSL Certificate

1. In hPanel, go to "Domains" → "SSL Certificates"
2. Request a free Let's Encrypt SSL certificate
3. Install it on your domain

### 12. Configure Caching and Performance

Add these optimizations to your `next.config.ts`:

```typescript
const nextConfig: NextConfig = {
  // ... existing config
  experimental: {
    optimizeCss: true
  },
  // Enable compression
  compress: true,
  // Optimize images
  images: {
    remotePatterns: [
      // Your image patterns
    ]
  }
};
```

### 13. Set Up Cron Jobs (Optional)

For automated tasks like backups:

1. In hPanel, go to "Cron Job"
2. Add a new cron job:
   ```bash
   0 2 * * * cd /home/your_username/public_html && npm run backup
   ```

## Troubleshooting

### Common Issues

1. **Application not starting**
   - Check error logs in hPanel
   - Ensure all environment variables are set
   - Verify Node.js version compatibility

2. **Database connection errors**
   - Double-check database credentials
   - Ensure database is accessible from your hosting plan
   - Check if database user has proper permissions

3. **Image loading issues**
   - Verify image paths in your data files
   - Check if images were uploaded correctly
   - Ensure proper permissions on image directories

4. **Admin panel access denied**
   - Verify admin user exists in database
   - Check user roles and permissions
   - Clear browser cache and cookies

### Checking Logs

```bash
# Check application logs
tail -f /home/your_username/logs/app.log

# Check error logs
tail -f /home/your_username/logs/error.log
```

## Maintenance

### Regular Updates

1. Update dependencies:
   ```bash
   npm outdated
   npm update
   ```

2. Rebuild the application:
   ```bash
   npm run build
   ```

3. Restart the application:
   ```bash
   npm run start
   ```

### Backup Strategy

1. Database backup:
   ```bash
   mysqldump -u username -p database_name > backup.sql
   ```

2. File backup:
   - Use Hostinger's backup feature
   - Or manually download files via FTP

## Support

If you encounter issues:

1. Check Hostinger's Knowledge Base
2. Contact Hostinger Support
3. Review Next.js deployment documentation
4. Check application logs for specific error messages

## Final Checklist

- [ ] Files uploaded correctly
- [ ] Environment variables configured
- [ ] Database connected and migrated
- [ ] SSL certificate installed
- [ ] Domain properly configured
- [ ] Admin panel accessible
- [ ] All pages loading correctly
- [ ] Images displaying properly
- [ ] Checkout process working
- [ ] Performance optimizations applied

Your Pachmarhi Tribal Art Marketplace should now be live and accessible to visitors!