import path from 'path';

export const PACKAGE_DIR = path.resolve('node_modules');

export const DIST_DIR = path.resolve('public', 'npm');
// 排除的文件名称
export const EXCLUDES = [
  /^\./,
  /\.d.ts$/i,
  /^(LICENSE|example|node_modules|test|bin)$/i,
  /\.(md|text|yml)$/i,
  /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i,
  /\.(png|jpe?g|gif|svg|bmp|webp)(\?.*)?$/i,
];
