/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Standalone output for deployment
  output: "standalone",
  
  // Image optimization configuration
  images: {
    unoptimized: process.env.NODE_ENV === 'production' ? true : false,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "randomuser.me",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "e2425-wads-l4ccg4-server.csbihub.id",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "e2425-wads-l4ccg4-server.csbihub.id",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "10.25.143.17",
        port: "3036",
        pathname: "/**",
      },
    ],
  },
  
  // Server actions are enabled by default in Next.js 14
  
  // Webpack configuration for frontend-only build
  webpack: (config) => {
    // Since we're using a separate backend, we don't need MongoDB polyfills
    // But we'll keep crypto and stream for client-side operations
    config.resolve.fallback = {
      ...config.resolve.fallback,
      crypto: require.resolve("crypto-browserify"),
      stream: require.resolve("stream-browserify"),
      buffer: require.resolve("buffer"),
    };

    return config;
  },
  
  // API rewrites to backend server
  async rewrites() {
    return [
      {
        source: '/api/backend/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/:path*`,
      },
    ];
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "img-src 'self' data: blob: https: http:; object-src 'none';",
          },
        ],
      },
    ];
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION,
  },
};

module.exports = nextConfig;
