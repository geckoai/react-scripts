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
import ora from 'ora';

function buildRendererBundle(): Promise<void> {
  const spinner = ora('[UI:Process] start build. \n').start();
  const { webpackRendererConfig } = require('../webpack.renderer.config');
  const compiler = webpack(webpackRendererConfig as Configuration);
  return new Promise((resolve, reject) => {
    compiler.run((err, status) => {
      if (err) {
        reject(err);
      }
      if (status && status.hasErrors()) {
        console.log(status.toString());
      }
    });

    compiler.hooks.afterEmit.tap('ElectronRendererDone', () => {
      resolve();
      spinner.succeed('[UI:Process] finish.');
    });
    compiler.hooks.failed.tap('ElectronMainFailed', (params) => {
      spinner.fail('[UI:Process] error.');
      console.log(params);
      reject();
    });
  });
}

function buildMainBundle(): Promise<any> {
  if (process.env.APP_RUNTIME_ENV === 'web') {
    return Promise.resolve();
  }
  const spinner = ora('[Main:Process] start build. \n').start();
  return new Promise((r, j) => {
    const { mainConfig } = require('../webpack.main.config');
    const compiler = webpack(mainConfig);
    compiler.run((err, stats) => {
      if (err) {
        j(err);
      }
      if (stats && stats.hasErrors()) {
        console.log(stats.toString());
      }
    });
    compiler.hooks.afterEmit.tap('ElectronMainDone', () => {
      spinner.succeed('[Main:Process] finish.');
      r(true);
    });
    compiler.hooks.failed.tap('ElectronMainFailed', (params) => {
      spinner.fail('[Main:Process] error.');
      console.log(params);
      j();
    });
  });
}
/**
 * build
 */
export function build(): void {
  rimraf.sync(path.resolve('dist'));
  Promise.all([buildMainBundle(), buildRendererBundle()]).catch((err) => {
    console.log(err);
  });
}
