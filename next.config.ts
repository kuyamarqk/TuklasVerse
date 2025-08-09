// next.config.ts (if you're using TypeScript)
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true, // Good practice for development
  images: {
    remotePatterns: [
      // Existing TMDB pattern
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        port: '',
        pathname: '/t/p/**',
      },
      // ⭐ New Jikan API image pattern ⭐
      {
        protocol: 'https',
        hostname: 'cdn.myanimelist.net', // The hostname for Jikan-provided images
        port: '',
        pathname: '/**', // Jikan image paths can vary, so allow all paths
      },
      // You might also need cdn.jikan.moe if images come directly from Jikan's CDN
      {
        protocol: 'https',
        hostname: 'cdn.jikan.moe',
        port: '',
        pathname: '/**',
      },
    ],
  }
};

export default nextConfig;