import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable react production optimizations
  reactStrictMode: true,
  
  // Image optimization configuration
  images: {
    domains: [
      'localhost',
      '127.0.0.1',
      'pachmarhi-marketplace.vercel.app',
      'pachmarhi.example.com'
    ],
    // Allow modern image formats
    formats: ['image/avif', 'image/webp']
  },
  
  // Enable compression for better performance
  compress: true,
  
  // Optimize fonts loading
  experimental: {
    optimizeCss: true
  },
  
  // Environment variables handling
  env: {
    NEXT_PUBLIC_APP_NAME: 'Pachmarhi Tribal Art Marketplace',
    NEXT_PUBLIC_APP_DESCRIPTION: 'Discover authentic tribal art and handicrafts from Pachmarhi'
  },
  
  // Disable ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  }
};

export default nextConfig;