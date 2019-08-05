import Dotenv from 'dotenv-webpack'
import { JsonifyWebpackPlugin } from 'jsonify-webpack-plugin'
import path from 'path'
import webpack from 'webpack'

const config: webpack.Configuration = {
  mode: 'production',
  entry: './src/injectable.tsx',
  output: {
    filename: 'injectable.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [new Dotenv(), new JsonifyWebpackPlugin(['injectable.js'])],
  node: {
    fs: 'empty'
  },
  module: {
    rules: [
      {
        test: /.tsx?$/,
        use: 'babel-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json']
  }
}

export default config
