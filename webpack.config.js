const path = require('path')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');

const browserConfig = {
  mode: "production",
  entry: [ 'webpack-hot-middleware/client', './src/browser/index.tsx' ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      { test: /\.(tsx)$/, use: 'babel-loader' },
      { test: /\.css$/, use: [ 'css-loader' ]}
    ]
  },
  devServer: {
    static: './dist',
    hot: true,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      __isBrowser__: "true"
    })
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },
}

const serverConfig = {
  mode: "production",
  entry: './src/server/index.tsx',
  target: 'node',
  externals: [nodeExternals()],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'server.js'
  },
  module: {
    rules: [
      { test: /\.(tsx?)$/, use: 'babel-loader' },
      { test: /\.css$/, use: [MiniCssExtractPlugin.loader, 'css-loader'] }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin(),
    new webpack.DefinePlugin({
      __isBrowser__: "false"
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },
}

module.exports = [browserConfig, serverConfig]