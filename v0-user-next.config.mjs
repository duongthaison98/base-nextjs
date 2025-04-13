/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone', // Optimizes for Docker
  experimental: {
    outputFileTracingRoot: process.env.NODE_ENV === 'production' ? undefined : process.cwd(),
  },
};

export default nextConfig;
