import path from 'path'
import webpack from 'webpack'
import merge from 'webpack-merge'
import baseConfig from './webpack.config.base'

const rendererConfig: webpack.Configuration = {
  mode: 'development',

  entry: path.resolve('src', 'main', 'index.ts'),

  output: {
    filename: 'main.js'
  },

  target: 'electron-main'
}

export default merge.smart(baseConfig, rendererConfig)
