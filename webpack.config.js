const path = require('path');

module.exports = {
  entry: './src/index.js',  // Your Node.js entry point (server-side code)
  target: 'web',  // Specify that the target is Node.js (not the browser)
  output: {
    path: path.resolve(__dirname, 'public'),  // Output to dist folder
    filename: 'bundle.js',  // The bundled file name
  },
  module: {
    rules: [
      {
        test: /\.js$/,  // Transpile JavaScript files
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',  // Use Babel to transpile modern JS to Node.js-compatible JS
          options: {
            presets: ['@babel/preset-env'],  // Preset for modern JavaScript
          },
        },
      },
    ],
  },
  resolve: {
    alias: {
      firebase: path.resolve(__dirname, 'node_modules/firebase'),  // Force Webpack to resolve Firebase from node_modules
    },
  },
  mode: 'production',  // You can switch to 'production' for production builds
  externals: [],  // Exclude node_modules from the output bundle
};
