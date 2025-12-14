/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Exclude seed route from client-side builds
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'app/seed': false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
