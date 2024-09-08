"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainConfig = void 0;
const webpack_1 = __importDefault(require("webpack"));
const path_1 = __importDefault(require("path"));
const isProduction = process.env.NODE_ENV === 'production';
exports.mainConfig = {
    entry: path_1.default.resolve('src', 'main'),
    output: {
        filename: '[name].js',
        libraryTarget: 'commonjs2',
        path: path_1.default.resolve('dist', 'main'),
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: 'ts-loader',
            },
        ],
    },
    plugins: [
        new webpack_1.default.WatchIgnorePlugin({
            paths: [/\.js$/, /\.d\.ts$/],
        }),
    ],
    resolve: {
        extensions: ['.ts', '.js', '.json', '.node'],
    },
    target: 'electron23.3-main',
    stats: false,
    performance: false,
    mode: isProduction ? 'production' : 'development',
    node: { __dirname: false, __filename: false, global: true },
};
