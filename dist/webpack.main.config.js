"use strict";
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
exports.mainConfig = exports.config = void 0;
// import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const webpack_merge_1 = require("webpack-merge");
const process = __importStar(require("node:process"));
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
        path: process.env.APP_RUNTIME_ENV === 'electron'
            ? path_1.default.resolve('build', 'web', 'main')
            : path_1.default.resolve('dist', 'main'),
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
exports.mainConfig = customWebpackConfig
    ? (0, webpack_merge_1.merge)(exports.config, customWebpackConfig)
    : exports.config;
