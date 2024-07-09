/**
 * MIT License
 * Copyright (c) 2021 RanYunLong<549510622@qq.com> @geckoai/react-scripts
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import {
  Configuration,
  IgnorePlugin,
  AutomaticPrefetchPlugin,
  WebpackPluginInstance,
} from 'webpack';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import StylelintWebpackPlugin, {
  Options as StylelintOpts,
} from 'stylelint-webpack-plugin';
import ESLintWebpackPlugin, {
  Options as EslintOpts,
} from 'eslint-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import { WebpackManifestPlugin } from 'webpack-manifest-plugin';
import ReactRefreshPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import postcssNormalize from 'postcss-normalize';
import { merge } from 'webpack-merge';
import path from 'path';
import fs from 'fs';
import ignoredFiles from './ignoredFiles';
import WebpackDevServer from 'webpack-dev-server';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import TerserPlugin from 'terser-webpack-plugin';
import * as process from 'node:process';

const isProduction = process.env.NODE_ENV === 'production';

const DotEnv = require('dotenv-webpack');
const HtmlWebpackDeployPlugin = require('html-webpack-deploy-plugin');
const redirectServedPath = require('react-dev-utils/redirectServedPathMiddleware');
const evalSourceMapMiddleware = require('react-dev-utils/evalSourceMapMiddleware');
const noopServiceWorkerMiddleware = require('react-dev-utils/noopServiceWorkerMiddleware');

const host = process.env.HOST;
const port = process.env.PORT;
const sockHost = process.env.WDS_SOCKET_HOST;
const sockPath = process.env.WDS_SOCKET_PATH;
const sockPort = process.env.WDS_SOCKET_PORT;

let babelLoaderOptions = {
  presets: [
    '@babel/preset-env',
    '@babel/preset-typescript',
    [
      '@babel/preset-react',
      {
        runtime: 'automatic',
      },
    ],
  ],
  plugins: [
    isProduction && 'transform-typescript-metadata',
    isProduction && ['@babel/plugin-proposal-decorators', { legacy: true }],
    isProduction && '@babel/plugin-proposal-class-properties',
    isProduction && [
      '@babel/plugin-transform-runtime',
      {
        regenerator: true,
        corejs: 2,
        version: '^7.7.4',
      },
    ],
    !isProduction && require.resolve('react-refresh/babel'),
    !isProduction && 'transform-typescript-metadata',
    !isProduction && ['@babel/plugin-proposal-decorators', { legacy: true }],
    !isProduction && '@babel/plugin-proposal-class-properties',
  ].filter(Boolean),
  cacheDirectory: true,
  cacheCompression: false,
  exclude: [
    // \\ for Windows, / for macOS and Linux
    /node_modules[\\/]core-js/,
    /node_modules[\\/]webpack[\\/]buildin/,
  ],
  compact: isProduction,
};

let cssLoaderOptions = {
  sourceMap: !isProduction,
};
let lessLoaderOptions = {
  sourceMap: !isProduction,
};
let sassLoaderOptions = {
  sourceMap: !isProduction,
};
let postCssOptions = {
  postcssOptions: {
    ident: 'postcss',
    plugins: (): any[] => [
      require('postcss-flexbugs-fixes'),
      require('postcss-preset-env')({
        autoprefixer: {
          flexbox: 'no-2009',
        },
        stage: 3,
      }),
      // Adds PostCSS Normalize as the reset css with default options,
      // so that it honors browserslist config in package.json
      // which in turn let's users customize the target behavior as per their needs.
      postcssNormalize(),
    ],
    sourceMap: !isProduction,
  },
};
const miniCssExtractPluginOptions = {
  publicPath: process.env.PUBLIC_URL,
};
let fileLoaderOptions = {};
let stylelintOptions: StylelintOpts | null = {};
let eslintOptions: EslintOpts | null = {
  extensions: ['js', 'mjs', 'jsx', 'ts', 'tsx'],
  cache: true,
  eslintPath: require.resolve('eslint'),
  cacheLocation: path.resolve('node_modules', '.cache/.eslintcache'),
  context: path.resolve('src'),
  cwd: path.resolve(),
  resolvePluginsRelativeTo: __dirname,
  baseConfig: {
    extends: [require.resolve('eslint-config-react-app/base')],
  },
};

let devServerOptions: WebpackDevServer.Configuration = {
  static: {
    directory: path.resolve('public'),
    publicPath: [process.env.PUBLIC_URL || ''],
    watch: {
      ignored: ignoredFiles(path.resolve('src')),
    },
  },
  client: {
    webSocketURL: {
      // Enable custom sockjs pathname for websocket connection to hot reloading server.
      // Enable custom sockjs hostname, pathname and port for websocket connection
      // to hot reloading server.
      hostname: sockHost,
      pathname: sockPath,
      port: sockPort,
    },
    logging: 'none',
    progress: false,
    overlay: {
      errors: true,
      warnings: false,
    },
  },
  host,
  port,
  historyApiFallback: {
    disableDotRule: true,
    index: process.env.PUBLIC_URL || '/',
  },
  setupMiddlewares: (middlewares, devServer) => {
    middlewares.unshift(evalSourceMapMiddleware(devServer));
    middlewares.push(redirectServedPath(process.env.PUBLIC_URL || '/'));
    middlewares.push(
      noopServiceWorkerMiddleware(process.env.PUBLIC_URL || '/')
    );
    return middlewares;
  },
  compress: true,
  open: false,
};

let customWebpackConfig: any;
let bundleAnalyzerOptions: object | null = {};
let deployOptions = null;
let alias = null;

if (fs.existsSync(path.resolve('project.config.js'))) {
  const config: any = require(path.resolve('project.config.js'));
  if (config.webpack) {
    customWebpackConfig = config.webpack;
  }
  if (config.babel) {
    babelLoaderOptions = Object.assign(babelLoaderOptions, config.babel);
  }

  if (config.style) {
    const { sass, less, css, postcss } = config.style;
    if (css) {
      cssLoaderOptions = Object.assign(cssLoaderOptions, css);
    }
    if (less) {
      lessLoaderOptions = Object.assign(lessLoaderOptions, less);
    }
    if (sass) {
      sassLoaderOptions = Object.assign(sassLoaderOptions, sass);
    }
    if (postcss) {
      postCssOptions = Object.assign(postCssOptions, postcss);
    }
  }

  if (config.alias) {
    alias = config.alias;
  }

  if (config.eslint) {
    if (typeof config.eslint !== 'boolean') {
      eslintOptions = Object.assign(eslintOptions, config.eslint);
    }
  } else {
    eslintOptions = null;
  }

  if (config.styleLint) {
    if (typeof config.styleLint !== 'boolean') {
      stylelintOptions = Object.assign(stylelintOptions, config.styleLint);
    }
  } else {
    stylelintOptions = null;
  }

  if (config.file) {
    if (typeof config.file !== 'boolean') {
      fileLoaderOptions = Object.assign(fileLoaderOptions, config.file);
    }
  }

  if (config.devServer) {
    devServerOptions = Object.assign(devServerOptions, config.devServer);
    if (devServerOptions.host && devServerOptions.host !== process.env.HOST) {
      process.env.HOST = devServerOptions.host;
    }

    if (devServerOptions.port && devServerOptions.port !== process.env.PORT) {
      process.env.PORT = devServerOptions.host;
    }
  }

  if (config.bundleAnalyzer) {
    bundleAnalyzerOptions = config.bundleAnalyzer;
  } else {
    bundleAnalyzerOptions = null;
  }

  if (config.deployOptions) {
    deployOptions = config.deployOptions;
  } else {
    deployOptions = null;
  }
}

/**
 * 获取样式loaders
 * @param isModule
 * @param importLoaders
 */
const getStyleLoaders = (isModule = false, importLoaders = 0): any => {
  const cssLoader: any = {
    loader: 'css-loader',
    options: {
      modules: isModule ? {} : false,
      import: true,
      url: true,
      importLoaders,
      ...cssLoaderOptions,
    },
  };
  const postCssLoader = {
    loader: 'postcss-loader',
    options: postCssOptions,
  };
  if (isModule) {
    cssLoader.options.modules.exportLocalsConvention = 'camelCase';
    cssLoader.options.modules.localIdentName =
      '[path][name]__[local]--[hash:base64:5]';
  }

  return [
    isProduction
      ? {
          loader: MiniCssExtractPlugin.loader,
          options: miniCssExtractPluginOptions,
        }
      : 'style-loader',
    cssLoader,
    postCssLoader,
  ];
};

const configuration: Configuration = {
  entry: [path.resolve('src'), require.resolve('react-refresh/runtime')],
  module: {
    rules: [
      {
        test: /\.module\.css$/i,
        use: getStyleLoaders(true, isProduction ? 1 : 0),
      },
      {
        test: /\.css$/i,
        exclude: /\.module\.css$/i,
        use: getStyleLoaders(false, isProduction ? 1 : 0),
      },
      {
        test: /\.module\.less$/,
        use: [
          ...getStyleLoaders(true, isProduction ? 1 : 0),
          {
            loader: 'less-loader',
            options: lessLoaderOptions,
          },
        ],
      },
      {
        test: /\.less$/,
        exclude: /\.module\.less$/i,
        use: [
          ...getStyleLoaders(false, isProduction ? 1 : 0),
          {
            loader: 'less-loader',
            options: lessLoaderOptions,
          },
        ],
      },
      {
        test: /\.module\.s[ac]ss$/i,
        use: [
          ...getStyleLoaders(true, isProduction ? 2 : 0),
          {
            loader: 'sass-loader',
            options: sassLoaderOptions,
          },
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        exclude: /\.module\.s[ac]ss$/i,
        use: [
          ...getStyleLoaders(false, isProduction ? 2 : 0),
          {
            loader: 'sass-loader',
            options: sassLoaderOptions,
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg|bmp|webp)(\?.*)?$/,
        use: [
          isProduction
            ? {
                loader: 'file-loader',
                options: {
                  name: 'assets/images/[name].[contenthash:8].[ext]',
                  limit: 10000,
                  esModule: false,
                  ...fileLoaderOptions,
                },
              }
            : {
                loader: 'url-loader',
                options: {
                  esModule: false,
                  limit: 8192,
                },
              },
        ],
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        use: [
          isProduction
            ? {
                loader: 'file-loader',
                options: {
                  name: 'assets/medias/[name].[contenthash:8].[ext]',
                  limit: 10000,
                  esModule: false,
                  ...fileLoaderOptions,
                },
              }
            : {
                loader: 'url-loader',
                options: {
                  esModule: false,
                },
              },
        ],
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: [
          isProduction
            ? {
                loader: 'file-loader',
                options: {
                  name: 'assets/fonts/[name].[contenthash:8].[ext]',
                  limit: 10000,
                  esModule: false,
                  ...fileLoaderOptions,
                },
              }
            : {
                loader: 'url-loader',
                options: {
                  esModule: false,
                },
              },
        ],
      },
      {
        test: /\.m?jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          'thread-loader',
          {
            loader: 'babel-loader',
            options: babelLoaderOptions,
          },
        ],
      },
      {
        test: /\.tsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          'thread-loader',
          {
            loader: 'babel-loader',
            options: babelLoaderOptions,
          },
        ],
      },
    ],
  },
  cache: {
    type: 'filesystem',
    store: 'pack',
    maxAge: 60000,
    compression: 'gzip',
    idleTimeout: 60000,
    idleTimeoutAfterLargeChanges: 1000,
    idleTimeoutForInitialStore: 0,
    profile: false,
    buildDependencies: {
      config: [__filename],
    },
  },
  output: {
    publicPath: process.env.PUBLIC_URL,
    path: path.resolve('dist'),
    filename: 'assets/js/[name].[contenthash:8].js',
  },
  target: isProduction ? 'browserslist' : 'web',
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.node'],
    alias: {
      ...alias,
      src: path.resolve('src'),
    },
  },
  plugins: [
    new AutomaticPrefetchPlugin(),
    new DotEnv({ systemvars: true }),
    new IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/,
    }),
    new HtmlWebpackPlugin({
      publicPath: process.env.PUBLIC_URL,
      inject: true,
      filename: 'index.html',
      template: path.resolve('public', 'index.html'),
      minify: true,
    }),
    new ForkTsCheckerWebpackPlugin({
      async: !isProduction,
      typescript: {
        configOverwrite: {
          compilerOptions: {
            sourceMap: !isProduction,
            skipLibCheck: true,
            inlineSourceMap: false,
            declarationMap: false,
            noEmit: true,
            incremental: true,
            tsBuildInfoFile: path.resolve(),
          },
        },
        context: path.resolve(),
        diagnosticOptions: {
          syntactic: true,
        },
        mode: 'write-references',
      },
      issue: {
        include: [
          { file: '../**/src/**/*.{ts,tsx}' },
          { file: '**/src/**/*.{ts,tsx}' },
        ],
        exclude: [
          { file: '**/src/**/__tests__/**' },
          { file: '**/src/**/?(*.){spec|test}.*' },
          { file: '**/src/setupProxy.*' },
          { file: '**/src/setupTests.*' },
        ],
      },
      logger: {
        infrastructure: 'silent',
      },
    }),
    eslintOptions && new ESLintWebpackPlugin(eslintOptions),
    stylelintOptions && new StylelintWebpackPlugin(stylelintOptions),
    deployOptions && isProduction && new HtmlWebpackDeployPlugin(deployOptions),
    !isProduction &&
      new ReactRefreshPlugin({
        overlay: false,
      }),
    isProduction &&
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve('public'),
            to: path.resolve('dist'),
            filter: (p: any): boolean => path.extname(p) !== '.html',
          },
        ],
      }),
    isProduction &&
      new WebpackManifestPlugin({
        fileName: 'asset-manifest.json',
        publicPath: process.env.PUBLIC_URL,
      }),
    isProduction &&
      new MiniCssExtractPlugin({
        filename: 'assets/styles/[name].[contenthash:8].css',
        ignoreOrder: isProduction,
      }),
    isProduction &&
      bundleAnalyzerOptions &&
      new BundleAnalyzerPlugin(bundleAnalyzerOptions),
  ].filter(Boolean),
  optimization: {
    runtimeChunk: 'single',
    minimize: isProduction,
    minimizer: [
      isProduction && new CssMinimizerPlugin(),
      isProduction &&
        new TerserPlugin({
          exclude: [/\/npm/, /^npm/, /\/public/, /^public/],
          parallel: true,
          terserOptions: {
            compress: {
              unused: true,
              drop_console: true,
              drop_debugger: true,
            },
          },
        }),
    ].filter(Boolean) as WebpackPluginInstance[],
    splitChunks: {
      maxAsyncSize: 200000,
      maxInitialSize: 100000,
      maxSize: 200000,
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
  stats: false,
  performance: false,
  devtool: !isProduction && 'inline-source-map',
  mode: isProduction ? 'production' : 'development',
};

export const ServerConfiguration = devServerOptions;

export const webpackConfig: Configuration = customWebpackConfig
  ? merge(configuration, customWebpackConfig)
  : configuration;
