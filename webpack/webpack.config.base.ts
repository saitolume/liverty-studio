import path from 'path'
import webpack from 'webpack'

const baseConfig: webpack.Configuration = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },

  output: {
    path: path.resolve('dist')
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  }
}

export default baseConfig
