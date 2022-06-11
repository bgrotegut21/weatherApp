const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: [
    'babel-polyfill',
    './src/scripts/data.js',
    './src/scripts/index.js',
    './src/scripts/methods.js',
    './src/scripts/search.js',
    './src/scripts/settings.js',
    './src/scripts/template.js',
    './src/scripts/dom.js',
    './src/scripts/ui.js',
    './src/scripts/menu.js',
    './src/scripts/store.js',
  ],
  devtool: 'inline-source-map',
  devServer: {
    static: './dist',
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Weather App',
    }),
  ],
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['@babel/preset-env', { targets: 'defaults' }]],
          },
        },
      },

      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },

      // {
      //   test: /\.(png|jpg)$/,
      //   loader: 'url-loader',
      // },
    ],
  },
};
