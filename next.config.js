/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    
    // Suppress warnings for optional dependencies
    config.resolve.alias = {
      ...config.resolve.alias,
      '@react-native-async-storage/async-storage': false,
      'pino-pretty': false,
    };
    
    // Ignore optional peer dependencies
    config.ignoreWarnings = [
      { module: /@metamask\/sdk/ },
      { module: /pino/ },
    ];
    
    return config;
  },
};

module.exports = nextConfig;

