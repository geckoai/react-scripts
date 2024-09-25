import { Configuration } from 'webpack';
// import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import path from 'path';
import fs from 'fs';
import { merge } from 'webpack-merge';

const isProduction = process.env.NODE_ENV === 'production';
let alias: any = null;
let customWebpackConfig: Configuration = {};
let tsLoaderOptions = {};

if (fs.existsSync(path.resolve('project.config.js'))) {
  const config = require(path.resolve('project.config.js'));

  if (config?.main?.alias) {
    alias = {
      ...config?.alias,
      ...config?.main?.alias,
    };
  }

  if (config?.main?.webpack) {
    customWebpackConfig = config?.main?.webpack;
  }

  if (config?.main?.ts) {
    tsLoaderOptions = Object.assign(tsLoaderOptions, config?.main?.ts);
  }
}

export const config: Configuration = {
  entry: path.resolve('src', 'main'),
  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    path: path.resolve('node_modules', '.electron', 'main'),
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              ...tsLoaderOptions,
              transpileOnly: true,
            },
          },
        ],
      },
    ],
  },
  // plugins: [
  //   new ForkTsCheckerWebpackPlugin({
  //     typescript: {
  //       configOverwrite: {
  //         include: ['src/main'],
  //       },
  //       diagnosticOptions: {
  //         syntactic: true,
  //       },
  //       mode: 'write-references',
  //     },
  //     async: !isProduction,
  //     logger: {
  //       infrastructure: 'silent',
  //     },
  //     issue: {
  //       include: [
  //         { file: '../**/src/main/**/*.ts' },
  //         { file: '**/src/main/**/*.ts' },
  //       ],
  //       exclude: [
  //         { file: '**/src/**/__tests__/**' },
  //         { file: '**/src/**/?(*.){spec|test}.*' },
  //       ],
  //     },
  //   }),
  // ],
  resolve: {
    extensions: ['.ts', '.js', '.json', '.node'],
    alias: { ...alias },
  },
  target: 'electron23.3-main',
  stats: false,
  performance: false,
  mode: isProduction ? 'production' : 'development',
  node: { __dirname: false, __filename: false, global: true },
};

export const mainConfig = customWebpackConfig
  ? merge(config, customWebpackConfig)
  : config;
