/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable static generation for pages that use client-side features
  output: "standalone",
  // This option has been removed in newer Next.js versions
  images: {
    unoptimized: false,
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
    ],
  },
  experimental: {
    serverActions: true,
  },
  webpack: (config) => {
    // Handle Node.js modules that MongoDB depends on
    config.resolve.fallback = {
      ...config.resolve.fallback,
      net: false,
      tls: false,
      dns: false,
      fs: false,
      crypto: require.resolve("crypto-browserify"),
      stream: require.resolve("stream-browserify"),
      buffer: require.resolve("buffer"),
    };

    // Exclude puppeteer from the build
    config.externals = [
      ...(config.externals || []),
      "puppeteer",
      "puppeteer-extra",
      "puppeteer-extra-plugin-stealth",
    ];

    return config;
  },
};

module.exports = nextConfig;
