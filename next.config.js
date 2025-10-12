/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['lucide-react'], // Required for ESM packages
};

module.exports = nextConfig;
