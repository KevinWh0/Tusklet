// eslint-disable-next-line @typescript-eslint/no-var-requires
const webpack = require('webpack');

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    dirs: ['src'],
  },

  reactStrictMode: true,
  swcMinify: true,

  // Uncoment to add domain whitelist
  // images: {
  //   domains: [
  //     'res.cloudinary.com',
  //   ],
  // },

  // SVGR
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            typescript: true,
            icon: true,
          },
        },
      ],
    });

    config.mode = 'development';
    config.devtool = 'source-map';
    // config.resolve.extensions = ['.ts', '.js'];
    config.resolve.fallback = {
      net: false,
      tls: false,
      dns: false,
      zlib: false,
      fs: false,
      stream: require.resolve('stream-browserify'),
      events: require.resolve('events/'),
      buffer: require.resolve('buffer/'),
      url: require.resolve('url/'),
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      crypto: require.resolve('crypto-browserify'),
      querystring: require.resolve('querystring-es3'),
      os: require.resolve('os-browserify/browser'),
      assert: require.resolve('assert/'),
    };
    config.module.rules.push({
      test: /.ts$/,
      loader: 'ts-loader',
    });

    config.plugins.push(
      new webpack.DefinePlugin({
        'process.browser': true,
        'process.env.NODE_DEBUG': false,
      })
    );

    return config;
  },
};

module.exports = nextConfig;
