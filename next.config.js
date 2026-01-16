/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {},
  webpack: (config) => {
    config.watchOptions = {
      ignored: ['**/data/**', '**/node_modules/**'],
    };
    return config;
  },
};

module.exports = nextConfig;
