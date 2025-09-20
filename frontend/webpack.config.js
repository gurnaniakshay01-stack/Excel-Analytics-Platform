const path = require('path');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProduction ? '[name].[contenthash].js' : 'bundle.js',
      chunkFilename: isProduction ? '[name].[contenthash].js' : '[name].js',
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx|mjs)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader', 'postcss-loader'],
        },
      ],
    },
    resolve: {
      extensions: ['.js', '.jsx', '.mjs'],
      alias: {
        // Handle framer-motion ES modules - use the main entry point
        'framer-motion': require.resolve('framer-motion'),
        // Handle jspdf ES modules
        'jspdf': 'jspdf/dist/jspdf.umd.min.js',
        'html2canvas': 'html2canvas/dist/html2canvas.min.js',
      },
      fallback: {
        // Remove core-js fallbacks that cause issues
        "crypto": false,
        "stream": false,
        "assert": false,
        "http": false,
        "https": false,
        "os": false,
        "url": false,
        "path": false,
        "fs": false,
        "util": false,
        "querystring": false,
        "zlib": false,
        "buffer": false,
        "process": false,
      },
    },
    devServer: {
      static: './public',
      hot: true,
      open: true,
      port: 3000,
      historyApiFallback: true,
    },
    mode: isProduction ? 'production' : 'development',
    // Increase performance limits and add optimizations
    performance: {
      maxAssetSize: 2 * 1024 * 1024, // 2MB
      maxEntrypointSize: 2 * 1024 * 1024, // 2MB
    },
    // Add optimization for production
    optimization: isProduction ? {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
          },
          framerMotion: {
            test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
            name: 'framer-motion',
            chunks: 'all',
            priority: 20,
          },
          chartjs: {
            test: /[\\/]node_modules[\\/](chart\.js|react-chartjs-2)[\\/]/,
            name: 'chartjs',
            chunks: 'all',
            priority: 20,
          },
          threejs: {
            test: /[\\/]node_modules[\\/](three|@react-three)[\\/]/,
            name: 'threejs',
            chunks: 'all',
            priority: 20,
          },
        },
      },
    } : undefined,
  };
};
