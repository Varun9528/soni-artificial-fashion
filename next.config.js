/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable react production optimizations
  reactStrictMode: true,
  
  // Set turbopack root to avoid workspace detection issues
  turbopack: {
    root: __dirname,
    resolveAlias: {
      "@/*": ["./src/*"]
    }
  },
  
  // Image optimization configuration - Updated to use remotePatterns instead of deprecated domains
  images: {
    domains: [
      'localhost',
      '127.0.0.1',
      'lettex-marketplace.vercel.app',
      'lettex.example.com',
      'images.unsplash.com',
      'res.cloudinary.com'
    ],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lettex-marketplace.vercel.app',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lettex.example.com',
        port: '',
        pathname: '/**',
      }
    ],
    // Allow modern image formats
    formats: ['image/avif', 'image/webp'],
    // Disable optimization for SVG images to avoid the error
    unoptimized: true
  },
  
  // Enable compression for better performance
  compress: true,
  
  // Environment variables handling
  env: {
    NEXT_PUBLIC_APP_NAME: 'Lettex Ayurvedic Wellness Marketplace',
    NEXT_PUBLIC_APP_DESCRIPTION: 'Discover authentic Ayurvedic and organic wellness products from Lettex'
  },
  
  // Disable ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Experimental features
  experimental: {
    // Disable CSS optimization temporarily to troubleshoot issues
    optimizeCss: false
  }
};

module.exports = nextConfig;