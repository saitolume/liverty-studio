import path from 'path'
import webpack from 'webpack'
import merge from 'webpack-merge'
import baseConfig from './webpack.config.base'

const rendererConfig: webpack.Configuration = {
  entry: path.resolve('src', 'main', 'index.ts'),

  output: {
    filename: 'main.js'
  },

  target: 'electron-main',

  node: {
    __dirname: false,
    __filename: false
  }
}

export default merge.smart(baseConfig, rendererConfig)
