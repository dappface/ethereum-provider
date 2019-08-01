const Dotenv = require('dotenv-webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const { JsonifyWebpackPlugin } = require('jsonify-webpack-plugin')

const baseConfig = {
  mode: 'development',
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      title: 'DAPPFACE Provider Example'
    }),
    new Dotenv()
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json']
  },
  devServer: {
    host: '0.0.0.0'
  }
}

const nativeConfig = {
  ...baseConfig,
  entry: './src/index.native.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.native.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      title: 'DAPPFACE Provider Example',
      filename: 'index.native.html'
    }),
    new Dotenv(),
    new JsonifyWebpackPlugin(['index.native.js'])
  ],
}

module.exports = [baseConfig, nativeConfig]
