import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import webpack from 'webpack'
import merge from 'webpack-merge'
import baseConfig from './webpack.config.base'

const rendererConfig: webpack.Configuration = {
  devtool: 'inline-source-map',

  entry: path.resolve('src', 'renderer', 'index.tsx'),

  output: {
    filename: 'renderer.js',
  },

  module: {
    rules: [
      {
        test: /\.html$/,
        loader: 'html-loader',
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve('src', 'renderer', 'index.html'),
    }),
  ],

  target: 'electron-renderer',

  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
  },
}

export default merge(baseConfig, rendererConfig)
