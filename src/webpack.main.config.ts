import webpack, { Configuration } from 'webpack';
import path from 'path';
const isProduction = process.env.NODE_ENV === 'production';

export const mainConfig: Configuration = {
  entry: path.resolve('src', 'main'),
  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    path: path.resolve('dist', 'main'),
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
    new webpack.WatchIgnorePlugin({
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
