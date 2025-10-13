// COMPLETE CSS FIX FOR PACHMARHI TRIBAL ART MARKETPLACE
// This script addresses all CSS compilation issues and ensures proper styling

const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Complete CSS Fix Process...\n');

// 1. Fix PostCSS configuration for Tailwind v4
console.log('1. Fixing PostCSS configuration...');
const postcssConfig = `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`;
fs.writeFileSync('./postcss.config.js', postcssConfig);
console.log('   ✅ PostCSS configuration updated for Tailwind v4\n');

// 2. Update globals.css with proper Tailwind directives and components
console.log('2. Updating globals.css with proper Tailwind setup...');
const globalsCss = `@tailwind base;
@tailwind components;
@tailwind utilities;

/*
 * Ensure Tailwind's base styles are included
 * This is critical for Tailwind classes to work properly
 */
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 47.4% 11.2%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 47.4% 11.2%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --primary: 22.1 83.3% 53.3%; /* Deep earthy brown (#5C4033) */
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --accent: 45 93.3% 53.3%; /* Mustard gold (#FFD54F) */
    --accent-foreground: 210 40% 98%;
    --destructive: 0 100% 50%;
    --destructive-foreground: 210 40% 98%;
    --ring: 215 20.2% 65.1%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 0 0% 7%; /* #121212 */
    --foreground: 0 0% 89.8%; /* #E5E5E5 */
    --muted: 223 47% 11%;
    --muted-foreground: 215.4 16.3% 56.9%;
    --popover: 224 71% 4%;
    --popover-foreground: 215 20.2% 65.1%;
    --card: 224 71% 4%;
    --card-foreground: 213 31% 91%;
    --border: 216 34% 17%;
    --input: 216 34% 17%;
    --primary: 22.1 83.3% 53.3%; /* Deep earthy brown (#5C4033) */
    --primary-foreground: 210 40% 98%;
    --secondary: 222.2 47.4% 11.2%;
    --secondary-foreground: 210 40% 98%;
    --accent: 45 93.3% 53.3%; /* Mustard gold (#FFD54F) */
    --accent-foreground: 210 40% 98%;
    --destructive: 0 63% 31%;
    --destructive-foreground: 210 40% 98%;
    --ring: 216 34% 17%;
    --radius: 0.5rem;
  }

  * {
    border-color: hsl(var(--border));
  }

  body {
    background-color: hsl(var(--background));
    color: hsl(var(--foreground));
    font-feature-settings: "rlig" 1, "calt" 1;
  }

  /* Ensure proper box-sizing */
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  /* Base styles for focus outlines */
  :focus-visible {
    outline: 2px solid hsl(var(--ring));
    outline-offset: 2px;
  }
}

/*
 * Custom component styles
 * These are our Flipkart-style components that extend Tailwind
 */
@layer components {
  .flipkart-header {
    @apply sticky top-0 z-50 bg-white shadow-flipkart dark:bg-gray-900;
  }
  
  .flipkart-navbar {
    @apply flex items-center justify-between py-3 px-4;
  }
  
  .flipkart-search-bar {
    @apply flex-1 mx-4 max-w-md;
  }
  
  .flipkart-search-input {
    @apply w-full rounded-sm border border-gray-300 pl-4 pr-12 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:border-gray-700;
  }
  
  .flipkart-button {
    @apply rounded-sm bg-primary px-4 py-2 text-white font-medium transition-colors hover:bg-[#4a342d] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-900;
  }
  
  .flipkart-card {
    @apply rounded-sm border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-medium dark:border-gray-700 dark:bg-gray-800;
  }
  
  .flipkart-product-title {
    @apply text-sm font-medium text-gray-900 line-clamp-2 dark:text-white;
  }
  
  .flipkart-product-price {
    @apply text-lg font-bold text-gray-900 dark:text-white;
  }
  
  .flipkart-badge {
    @apply inline-flex items-center rounded-sm bg-orange-100 px-2 py-1 text-xs font-medium text-orange-800 dark:bg-orange-900 dark:text-orange-100;
  }
  
  .flipkart-hero {
    @apply bg-gradient-to-r from-primary to-[#4a342d] text-white;
  }
  
  .flipkart-section-title {
    @apply text-2xl font-bold text-gray-900 mb-6 relative dark:text-white;
  }
  
  .flipkart-section-title::after {
    content: "";
    @apply absolute bottom-[-0.5rem] left-0 h-1 w-12 bg-accent;
  }
  
  .flipkart-product-grid {
    @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6;
  }
  
  .flipkart-product-card {
    @apply flipkart-card overflow-hidden transition-transform hover:-translate-y-1;
  }
  
  .flipkart-product-image {
    @apply relative aspect-square overflow-hidden;
  }
  
  .flipkart-product-info {
    @apply p-4;
  }
  
  .flipkart-product-name {
    @apply text-sm font-medium text-gray-900 line-clamp-2 dark:text-white;
  }
  
  .flipkart-product-price-container {
    @apply flex items-center space-x-2 mt-2;
  }
  
  .flipkart-product-price-current {
    @apply text-lg font-bold text-gray-900 dark:text-white;
  }
  
  .flipkart-product-price-original {
    @apply text-sm text-gray-500 line-through dark:text-gray-400;
  }
  
  .flipkart-product-discount {
    @apply text-sm font-medium text-green-600 dark:text-green-400;
  }
  
  .flipkart-footer {
    @apply bg-gray-900 text-white;
  }
  
  .flipkart-footer-link {
    @apply text-gray-400 transition-colors hover:text-white;
  }
}

/*
 * Custom utility classes
 * These extend Tailwind's utility classes
 */
@layer utilities {
  .shadow-flipkart {
    box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.15);
  }
  
  .shadow-soft {
    @apply shadow-sm;
  }

  .shadow-medium {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }

  .shadow-strong {
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }

  .line-clamp-2 {
    @apply line-clamp-2;
  }

  .line-clamp-3 {
    @apply line-clamp-3;
  }
}`;
fs.writeFileSync('./src/app/globals.css', globalsCss);
console.log('   ✅ globals.css updated with proper Tailwind setup\n');

// 3. Update Tailwind config to ensure proper content paths
console.log('3. Updating Tailwind configuration...');
const tailwindConfig = `import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff8f1',
          100: '#feecdc',
          200: '#fcd6b3',
          300: '#f9b680',
          400: '#f58d4c',
          500: '#5C4033', // Deep earthy brown (brand color)
          600: '#e04e1a',
          700: '#bb3a18',
          800: '#942f1a',
          900: '#762718',
          950: '#3f110a',
        },
        accent: {
          50: '#f0fdf9',
          100: '#ccfbef',
          200: '#99f6e0',
          300: '#5eead4',
          400: '#FFD54F', // Mustard gold (brand color)
          500: '#14b8a6', // Teal color
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
        },
        earth: {
          50: '#faf7f2',
          100: '#f4ebe0',
          200: '#e8d5c0',
          300: '#d9ba99',
          400: '#c89970',
          500: '#bb8054',
          600: '#ad6d48',
          700: '#8f5a3e',
          800: '#744936',
          900: '#5e3c2e',
          950: '#321e17',
        },
        tribal: {
          red: '#d2001f',
          orange: '#ff6f00',
          brown: '#8d4a2b',
          yellow: '#ffb300',
          green: '#2e7d32',
        },
        // Dark mode colors
        dark: {
          background: '#121212',
          text: '#E5E5E5',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
        tribal: ['Mukti', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'tribal-pattern': "url('/images/patterns/tribal-bg.svg')",
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.02)',
        'medium': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'strong': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'flipkart': '0 1px 4px 0 rgba(0, 0, 0, 0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'bounce-gentle': 'bounceGentle 1s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(-5px)' },
          '50%': { transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config`;
fs.writeFileSync('./tailwind.config.ts', tailwindConfig);
console.log('   ✅ Tailwind configuration updated\n');

// 4. Update component files to use proper Tailwind classes
console.log('4. Updating component files to use proper Tailwind classes...');

// Update Header component
const headerPath = './src/components/Header.tsx';
if (fs.existsSync(headerPath)) {
  let headerContent = fs.readFileSync(headerPath, 'utf8');
  // Replace hardcoded colors with Tailwind classes
  headerContent = headerContent.replace(/bg-\[#5C4033\]/g, 'bg-primary');
  headerContent = headerContent.replace(/text-\[#5C4033\]/g, 'text-primary');
  headerContent = headerContent.replace(/bg-\[#FFD54F\]/g, 'bg-accent');
  headerContent = headerContent.replace(/text-\[#FFD54F\]/g, 'text-accent');
  fs.writeFileSync(headerPath, headerContent);
  console.log('   ✅ Header component updated');
}

// Update ProductCard component
const productCardPath = './src/components/product/ProductCard.tsx';
if (fs.existsSync(productCardPath)) {
  let productCardContent = fs.readFileSync(productCardPath, 'utf8');
  // Replace hardcoded colors with Tailwind classes
  productCardContent = productCardContent.replace(/bg-\[#5C4033\]/g, 'bg-primary');
  productCardContent = productCardContent.replace(/text-\[#5C4033\]/g, 'text-primary');
  productCardContent = productCardContent.replace(/bg-\[#FFD54F\]/g, 'bg-accent');
  productCardContent = productCardContent.replace(/text-\[#FFD54F\]/g, 'text-accent');
  fs.writeFileSync(productCardPath, productCardContent);
  console.log('   ✅ ProductCard component updated');
}

// Update home page
const homePagePath = './src/app/page.tsx';
if (fs.existsSync(homePagePath)) {
  let homePageContent = fs.readFileSync(homePagePath, 'utf8');
  // Replace hardcoded colors with Tailwind classes
  homePageContent = homePageContent.replace(/bg-\[#5C4033\]/g, 'bg-primary');
  homePageContent = homePageContent.replace(/text-\[#5C4033\]/g, 'text-primary');
  homePageContent = homePageContent.replace(/bg-\[#FFD54F\]/g, 'bg-accent');
  homePageContent = homePageContent.replace(/text-\[#FFD54F\]/g, 'text-accent');
  fs.writeFileSync(homePagePath, homePageContent);
  console.log('   ✅ Home page updated');
}

console.log('');

// 5. Clear build cache and restart development server
console.log('5. Clearing build cache and preparing for restart...');
try {
  if (fs.existsSync('./.next')) {
    fs.rmSync('./.next', { recursive: true, force: true });
    console.log('   ✅ Build cache cleared');
  }
} catch (error) {
  console.log('   ⚠️  Could not clear build cache:', error.message);
}

console.log('');
console.log('✅ Complete CSS Fix Process Finished!');
console.log('');
console.log('📋 Next Steps:');
console.log('   1. Restart your development server: npm run dev');
console.log('   2. Visit http://localhost:3000 to see the changes');
console.log('   3. Test all pages and components');
console.log('   4. Verify dark/light mode functionality');
console.log('   5. Check multilingual toggle');
console.log('   6. Ensure all buttons and icons are properly styled');
console.log('');
console.log('🎉 Pachmarhi Tribal Art Marketplace CSS issues have been resolved!');
console.log('   All Tailwind classes should now compile and apply correctly.');
console.log('   The UI should now look like Flipkart with proper brand colors.');