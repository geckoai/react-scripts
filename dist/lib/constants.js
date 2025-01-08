"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EXCLUDES = exports.DIST_DIR = exports.PACKAGE_DIR = void 0;
const path_1 = __importDefault(require("path"));
exports.PACKAGE_DIR = path_1.default.resolve('node_modules');
exports.DIST_DIR = path_1.default.resolve('public', 'npm');
// 排除的文件名称
exports.EXCLUDES = [
    /^\./,
    /\.d.ts$/i,
    /^(LICENSE|example|node_modules|test|bin)$/i,
    /\.(md|text|yml)$/i,
    /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i,
    /\.(png|jpe?g|gif|svg|bmp|webp)(\?.*)?$/i,
];
