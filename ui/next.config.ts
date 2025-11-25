import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  },
  async rewrites() {
    return [
      {
        source: '/api/upload',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/upload`,
      },
      {
        source: '/api/download/:code',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/download/:code`,
      },
    ];
  },
};

export default nextConfig;
