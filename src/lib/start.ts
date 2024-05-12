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

import { Configuration, webpack } from 'webpack';
import Server from 'webpack-dev-server';
import path from 'path';
import chalk from 'chalk';
import { clearConsole } from './clear-console';
import ip from 'ip';
import { DIST_DIR, PACKAGE_DIR } from './constants';
import { copy } from './copy';

const isInteractive = process.stdout.isTTY;

const openBrowser = require('react-dev-utils/openBrowser');

const { webpackConfig, devServer } = require('../webpack.config');
const compiler = webpack(webpackConfig as Configuration);
compiler.hooks.invalid.tap('invalid', () => {
  if (isInteractive) {
    clearConsole();
  }
});
compiler.hooks.beforeCompile.tap('beforeCompile', () => {
  if (isInteractive) {
    clearConsole();
    console.log('Compiling...');
  }
});

if (webpackConfig) {
  if (webpackConfig.externals) {
    try {
      console.log(`Copy externals files from ${PACKAGE_DIR} to ${DIST_DIR}`);
      const strings = Object.keys(webpackConfig.externals);
      copy(PACKAGE_DIR, strings, DIST_DIR);
    } catch (e) {
      console.error(e);
    }
  }
}

const server = new Server(devServer as Server.Configuration, compiler);

const port = server.options.port || 3000;
server.options.open = false;
const protocol: string =
  (server.options.server || ({ type: 'http' } as any)).type || 'http';
const address = ip.address();

const PACK = require(path.resolve('package.json'));
compiler.hooks.done.tap('done', (stats) => {
  if (isInteractive) {
    clearConsole();
    if (!stats.hasErrors() && !stats.hasWarnings()) {
      console.log(chalk.green('Compiled successfully!'));
      console.log(`You can now view ${PACK.name} in the browser.\n`);
      console.log(`Local:            ${protocol}://localhost:${port}`);
      console.log(`On Your Network:  ${protocol}://${address}:${port}\n`);
      console.log('Note that the development build is not optimized.');
      console.log(
        `To create a production build, use ${chalk.cyan('yarn build.')}`
      );
    } else {
      console.log(
        stats.toString({
          all: false,
          errors: true,
          warnings: true,
          colors: true,
        })
      );
    }
  }
});

server.startCallback(() => {
  console.log(chalk.cyan('Starting the development server...\n'));
  openBrowser(`${protocol}://localhost:${port}`);
});
