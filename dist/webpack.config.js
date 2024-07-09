"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.webpackConfig = exports.ServerConfiguration = void 0;
const webpack_1 = require("webpack");
const fork_ts_checker_webpack_plugin_1 = __importDefault(require("fork-ts-checker-webpack-plugin"));
const html_webpack_plugin_1 = __importDefault(require("html-webpack-plugin"));
const mini_css_extract_plugin_1 = __importDefault(require("mini-css-extract-plugin"));
const copy_webpack_plugin_1 = __importDefault(require("copy-webpack-plugin"));
const stylelint_webpack_plugin_1 = __importDefault(require("stylelint-webpack-plugin"));
const eslint_webpack_plugin_1 = __importDefault(require("eslint-webpack-plugin"));
const css_minimizer_webpack_plugin_1 = __importDefault(require("css-minimizer-webpack-plugin"));
const webpack_manifest_plugin_1 = require("webpack-manifest-plugin");
const react_refresh_webpack_plugin_1 = __importDefault(require("@pmmmwh/react-refresh-webpack-plugin"));
const postcss_normalize_1 = __importDefault(require("postcss-normalize"));
const webpack_merge_1 = require("webpack-merge");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const ignoredFiles_1 = __importDefault(require("./ignoredFiles"));
const webpack_bundle_analyzer_1 = require("webpack-bundle-analyzer");
const terser_webpack_plugin_1 = __importDefault(require("terser-webpack-plugin"));
const process = __importStar(require("node:process"));
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
        plugins: () => [
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
            (0, postcss_normalize_1.default)(),
        ],
        sourceMap: !isProduction,
    },
};
const miniCssExtractPluginOptions = {
    publicPath: process.env.PUBLIC_URL,
};
let fileLoaderOptions = {};
let stylelintOptions = {};
let eslintOptions = {
    extensions: ['js', 'mjs', 'jsx', 'ts', 'tsx'],
    cache: true,
    eslintPath: require.resolve('eslint'),
    cacheLocation: path_1.default.resolve('node_modules', '.cache/.eslintcache'),
    context: path_1.default.resolve('src'),
    cwd: path_1.default.resolve(),
    resolvePluginsRelativeTo: __dirname,
    baseConfig: {
        extends: [require.resolve('eslint-config-react-app/base')],
    },
};
let devServerOptions = {
    static: {
        directory: path_1.default.resolve('public'),
        publicPath: [process.env.PUBLIC_URL || ''],
        watch: {
            ignored: (0, ignoredFiles_1.default)(path_1.default.resolve('src')),
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
        middlewares.push(noopServiceWorkerMiddleware(process.env.PUBLIC_URL || '/'));
        return middlewares;
    },
    compress: true,
    open: false,
};
let customWebpackConfig;
let bundleAnalyzerOptions = {};
let deployOptions = null;
let alias = null;
if (fs_1.default.existsSync(path_1.default.resolve('project.config.js'))) {
    const config = require(path_1.default.resolve('project.config.js'));
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
    }
    else {
        eslintOptions = null;
    }
    if (config.styleLint) {
        if (typeof config.styleLint !== 'boolean') {
            stylelintOptions = Object.assign(stylelintOptions, config.styleLint);
        }
    }
    else {
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
    }
    else {
        bundleAnalyzerOptions = null;
    }
    if (config.deployOptions) {
        deployOptions = config.deployOptions;
    }
    else {
        deployOptions = null;
    }
}
/**
 * 获取样式loaders
 * @param isModule
 * @param importLoaders
 */
const getStyleLoaders = (isModule = false, importLoaders = 0) => {
    const cssLoader = {
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
                loader: mini_css_extract_plugin_1.default.loader,
                options: miniCssExtractPluginOptions,
            }
            : 'style-loader',
        cssLoader,
        postCssLoader,
    ];
};
const configuration = {
    entry: [path_1.default.resolve('src'), require.resolve('react-refresh/runtime')],
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
        path: path_1.default.resolve('dist'),
        filename: 'assets/js/[name].[contenthash:8].js',
    },
    target: isProduction ? 'browserslist' : 'web',
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.node'],
        alias: {
            ...alias,
            src: path_1.default.resolve('src'),
        },
    },
    plugins: [
        new webpack_1.AutomaticPrefetchPlugin(),
        new DotEnv({ systemvars: true }),
        new webpack_1.IgnorePlugin({
            resourceRegExp: /^\.\/locale$/,
            contextRegExp: /moment$/,
        }),
        new html_webpack_plugin_1.default({
            publicPath: process.env.PUBLIC_URL,
            inject: true,
            filename: 'index.html',
            template: path_1.default.resolve('public', 'index.html'),
            minify: true,
        }),
        new fork_ts_checker_webpack_plugin_1.default({
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
                        tsBuildInfoFile: path_1.default.resolve(),
                    },
                },
                context: path_1.default.resolve(),
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
        eslintOptions && new eslint_webpack_plugin_1.default(eslintOptions),
        stylelintOptions && new stylelint_webpack_plugin_1.default(stylelintOptions),
        deployOptions && new HtmlWebpackDeployPlugin(deployOptions),
        !isProduction &&
            new react_refresh_webpack_plugin_1.default({
                overlay: false,
            }),
        isProduction &&
            new copy_webpack_plugin_1.default({
                patterns: [
                    {
                        from: path_1.default.resolve('public'),
                        to: path_1.default.resolve('dist'),
                        filter: (p) => path_1.default.extname(p) !== '.html',
                    },
                ],
            }),
        isProduction &&
            new webpack_manifest_plugin_1.WebpackManifestPlugin({
                fileName: 'asset-manifest.json',
                publicPath: process.env.PUBLIC_URL,
            }),
        isProduction &&
            new mini_css_extract_plugin_1.default({
                filename: 'assets/styles/[name].[contenthash:8].css',
                ignoreOrder: isProduction,
            }),
        isProduction &&
            bundleAnalyzerOptions &&
            new webpack_bundle_analyzer_1.BundleAnalyzerPlugin(bundleAnalyzerOptions),
    ].filter(Boolean),
    optimization: {
        runtimeChunk: 'single',
        minimize: isProduction,
        minimizer: [
            isProduction && new css_minimizer_webpack_plugin_1.default(),
            isProduction &&
                new terser_webpack_plugin_1.default({
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
        ].filter(Boolean),
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
exports.ServerConfiguration = devServerOptions;
exports.webpackConfig = customWebpackConfig
    ? (0, webpack_merge_1.merge)(configuration, customWebpackConfig)
    : configuration;
