const path = require('path');

module.exports = {
  trailingSlash: true,
  reactStrictMode: false,

  webpack: (config, { isServer }) => {
    // Add any custom webpack configuration here

    config.resolve.alias = {
      ...config.resolve.alias,
      apexcharts: path.resolve(__dirname, './node_modules/apexcharts-clevision')
      // Add other aliases if needed
    };

    return config;
  },

  // Any additional configuration for Next.js 14.0.4 can be added here
};
