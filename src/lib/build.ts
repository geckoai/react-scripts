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
import rimraf from 'rimraf';
import path from 'path';
import { webpackConfig } from '../webpack.config';
import { DIST_DIR, PACKAGE_DIR } from './constants';
import { copy } from './copy';

/**
 * build
 */
export function build(): void {
  rimraf.sync(path.resolve('dist'));
  const { webpackConfig } = require('../webpack.config');
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
  const compiler = webpack(webpackConfig as Configuration);
  compiler.run((err, status) => {
    if (err) {
      console.log(err);
    } else if (status) {
      console.log(
        status.toString({
          all: false,
          builtAt: true,
          warnings: true,
          errors: true,
        })
      );
    }
  });
}
