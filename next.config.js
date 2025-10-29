/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false, // Disable SWC minification to avoid binary issues
  images: {
    // Enable image optimization
    unoptimized: false,
    // Allow images from these domains
    domains: [
      'localhost',
      '127.0.0.1',
      // Add any external domains if needed
    ],
    // Set device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // Set image sizes for different layouts
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Enable compression
  compress: true,
  // Enable webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Enable tree shaking
    config.optimization.usedExports = true;
    
    // Only in production
    if (!dev) {
      // Enable aggressive code splitting
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      };
    }
    
    return config;
  },
};

module.exports = nextConfig;