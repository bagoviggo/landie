/** @type {import('next').NextConfig} */
const nextConfig = {
  // Exclude /seed route from production build
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'].filter(ext => {
    if (process.env.NODE_ENV === 'production') {
      return !ext.includes('seed');
    }
    return true;
  }),
};

module.exports = nextConfig;
