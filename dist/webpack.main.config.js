"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainConfig = exports.config = void 0;
const fork_ts_checker_webpack_plugin_1 = __importDefault(require("fork-ts-checker-webpack-plugin"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const webpack_merge_1 = require("webpack-merge");
const isProduction = process.env.NODE_ENV === 'production';
let alias = null;
let customWebpackConfig = {};
let tsLoaderOptions = {};
if (fs_1.default.existsSync(path_1.default.resolve('project.config.js'))) {
    const config = require(path_1.default.resolve('project.config.js'));
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
exports.config = {
    entry: path_1.default.resolve('src', 'main'),
    output: {
        filename: '[name].js',
        libraryTarget: 'commonjs2',
        path: isProduction
            ? path_1.default.resolve('dist', 'main')
            : path_1.default.resolve('node_modules', '.electron'),
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /(node_modules|bower_components)/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: tsLoaderOptions,
                    },
                ],
            },
        ],
    },
    plugins: [
        new fork_ts_checker_webpack_plugin_1.default({
            typescript: {
                diagnosticOptions: {
                    syntactic: true,
                },
                mode: 'write-references',
            },
            async: !isProduction,
            logger: {
                infrastructure: 'silent',
            },
            issue: {
                include: [
                    { file: '../**/src/main/**/*.ts' },
                    { file: '**/src/main/**/*.ts' },
                ],
                exclude: [
                    { file: '**/src/**/__tests__/**' },
                    { file: '**/src/**/?(*.){spec|test}.*' },
                ],
            },
        }),
    ],
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
exports.mainConfig = customWebpackConfig
    ? (0, webpack_merge_1.merge)(exports.config, customWebpackConfig)
    : exports.config;
