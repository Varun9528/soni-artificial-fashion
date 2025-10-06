#!/bin/bash

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

echo "✅ Database setup complete!"