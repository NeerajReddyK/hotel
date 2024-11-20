// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;

// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Add node-loader to handle native modules
    config.module.rules.push({
      test: /\.node$/,
      loader: 'node-loader',
    });

    // Configure external modules
    config.externals = [...(config.externals || []), {
      'escpos-usb': 'commonjs escpos-usb',
      'usb': 'commonjs usb'
    }];

    return config;
  },
  // Required for native modules
  experimental: {
    serverComponentsExternalPackages: ['escpos-usb', 'usb']
  }
};

export default nextConfig;
