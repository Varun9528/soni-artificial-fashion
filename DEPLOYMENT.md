# Deployment Guide for Pachmarhi Marketplace

## Hostinger Deployment Steps

### 1. Prerequisites
- Hostinger hosting account with Node.js support
- MySQL database access
- SSH access to your hosting account

### 2. Environment Setup

1. **Create a MySQL Database**
   - Log into your Hostinger control panel
   - Navigate to MySQL Databases
   - Create a new database for the application
   - Note down the database name, username, and password

2. **Configure Environment Variables**
   Create a `.env.production` file with the following variables:
   ```env
   # Database Configuration
   DATABASE_URL="mysql://username:password@localhost:3306/database_name"
   
   # JWT Secret for authentication
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   
   # Application Settings
   NEXT_PUBLIC_APP_URL="https://yourdomain.com"
   NEXT_PUBLIC_API_URL="https://yourdomain.com/api"
   
   # Email Configuration (if using email service)
   EMAIL_SERVER="smtp.hostinger.com"
   EMAIL_PORT=465
   EMAIL_USERNAME="noreply@yourdomain.com"
   EMAIL_PASSWORD="your-email-password"
   
   # Payment Gateway (if using payment integration)
   RAZORPAY_KEY_ID="your-razorpay-key-id"
   RAZORPAY_SECRET="your-razorpay-secret"
   ```

### 3. Build Process

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/pachmarhi-marketplace.git
   cd pachmarhi-marketplace
   ```

2. **Install Dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Database Setup**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma migrate deploy
   
   # Seed initial data (optional)
   npm run seed
   ```

4. **Build the Application**
   ```bash
   npm run build
   ```

### 4. Deployment

1. **Start the Application**
   ```bash
   npm run start
   ```

2. **Using PM2 for Process Management (Recommended)**
   ```bash
   # Install PM2 globally
   npm install -g pm2
   
   # Start the application with PM2
   pm2 start npm --name "pachmarhi-marketplace" -- run "start"
   
   # Save PM2 configuration
   pm2 save
   ```

### 5. Hostinger-Specific Configuration

1. **Set up Node.js Application in Hostinger**
   - Go to Advanced > Node.js in your Hostinger control panel
   - Set Application Startup File to `server.js` (Next.js will create this)
   - Set Application Entry Point to `npm run start`

2. **Configure Domain**
   - Point your domain to the Hostinger nameservers
   - Set up SSL certificate through Hostinger's free SSL option

3. **Set up Cron Jobs (Optional)**
   For periodic tasks like cleanup or reports:
   ```bash
   # Daily cleanup at 2 AM
   0 2 * * * cd /path/to/your/app && npm run cleanup
   ```

### 6. Database Migration to Hostinger

If you're migrating from a local database:

1. **Export Local Database**
   ```bash
   mysqldump -u local_user -p local_database > pachmarhi_backup.sql
   ```

2. **Import to Hostinger Database**
   - Use phpMyAdmin in Hostinger control panel
   - Or use command line:
   ```bash
   mysql -h localhost -u hostinger_user -p hostinger_database < pachmarhi_backup.sql
   ```

### 7. Monitoring and Maintenance

1. **Check Application Status**
   ```bash
   pm2 status
   pm2 logs pachmarhi-marketplace
   ```

2. **Restart Application**
   ```bash
   pm2 restart pachmarhi-marketplace
   ```

3. **Update Application**
   ```bash
   # Pull latest changes
   git pull origin main
   
   # Install new dependencies
   npm install --legacy-peer-deps
   
   # Run database migrations if needed
   npx prisma migrate deploy
   
   # Rebuild application
   npm run build
   
   # Restart application
   pm2 restart pachmarhi-marketplace
   ```

### 8. Troubleshooting

1. **Common Issues**
   - Port conflicts: Ensure no other applications are using port 3000
   - Database connection: Verify database credentials in .env file
   - Memory issues: Hostinger's shared hosting may have memory limits

2. **Check Logs**
   ```bash
   # Next.js logs
   pm2 logs pachmarhi-marketplace
   
   # System logs
   tail -f /var/log/nginx/error.log
   ```

3. **Performance Optimization**
   - Enable caching in Next.js
   - Use CDN for static assets
   - Optimize images with Next.js Image component

### 9. Security Considerations

1. **Environment Variables**
   - Never commit .env files to version control
   - Use strong, unique passwords
   - Rotate secrets regularly

2. **SSL/TLS**
   - Always use HTTPS in production
   - Redirect HTTP to HTTPS

3. **Firewall**
   - Restrict database access to application server only
   - Use Hostinger's firewall if available

### 10. Backup Strategy

1. **Database Backup**
   ```bash
   # Automated backup script
   mysqldump -h localhost -u username -p database_name > backup_$(date +%Y%m%d).sql
   ```

2. **Application Backup**
   - Regular Git commits
   - Backup of uploaded images (if stored locally)
   - Configuration file backups

This deployment guide should help you successfully deploy the Pachmarhi Marketplace on Hostinger. Make sure to test thoroughly after deployment and monitor the application for any issues.