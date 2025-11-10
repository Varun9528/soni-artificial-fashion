/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static exports for better performance
  output: 'standalone',
  
  // Configure image optimization
  images: {
    domains: ['localhost', '127.0.0.1'],
    // Allow SVG images
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Configure webpack
  webpack: (config) => {
    // Important: return the modified config
    return config;
  },
}

module.exports = nextConfig