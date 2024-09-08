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
import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import * as process from 'node:process';
const electron = require('electron');

const isInteractive = process.stdout.isTTY;

let mainProcess: ChildProcessWithoutNullStreams | null;
let electronRestart = false;

function runRendererBundle(): Promise<void> {
  const {
    webpackRendererConfig,
    ServerConfiguration,
  } = require('../webpack.renderer.config');

  const compiler = webpack(webpackRendererConfig as Configuration);
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
  const server = new Server(ServerConfiguration, compiler);
  const port = server.options.port || 3000;
  server.options.open = false;
  const protocol: string =
    (server.options.server || ({ type: 'http' } as any)).type || 'http';
  const address = ip.address();
  const PACK: { name: string } = require(path.resolve('package.json'));
  compiler.hooks.done.tap('ElectronRendererDone', (stats) => {
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
  process.on('SIGINT', function () {
    server.stopCallback();
    process.exit();
  });
  process.on('SIGTERM', function () {
    server.stopCallback();
    process.exit();
  });

  return new Promise((resolve, reject) => {
    server.startCallback(() => {
      if (isInteractive) {
        clearConsole();
      }
      console.log(chalk.cyan('Starting the development server...\n'));
      resolve();
    });
    compiler.hooks.failed.tap('ElectronRendererError', () => reject());
  });
}

function runMainBundle(): Promise<void> {
  const { mainConfig } = require('../webpack.main.config');
  const compiler = webpack(mainConfig);
  return new Promise((resolve, reject) => {
    compiler.watch({}, (err, stats) => {
      if (err) {
        throw err;
      }

      if (stats && stats.hasErrors()) {
        console.log(stats.toString());
      }

      if (mainProcess) {
        electronRestart = true;
        mainProcess.removeAllListeners('close');
        // 监听主进程关闭事件
        mainProcess.once('close', () => {
          // 重启Electron
          startElectron();
          electronRestart = false;
        });
        // 杀死electron进程
        if (mainProcess.pid) {
          process.kill(mainProcess.pid);
        }
        // 清空进程
        mainProcess = null;
      }
    });
    compiler.hooks.done.tap('ElectronMainDone', () => resolve());
    compiler.hooks.failed.tap('ElectronMainFailed', () => reject());
  });
}

function startElectron(): void {
  mainProcess = spawn(electron, [path.resolve('dist', 'main', 'main.js')]);
  mainProcess.stdout.pipe(process.stdout);
  mainProcess.on('close', () => {
    if (!electronRestart) {
      process.exit();
    }
  });
}

function start(): void {
  Promise.all([runMainBundle(), runRendererBundle()])
    .then(() => {
      startElectron();
    })
    .catch((err) => {
      console.log(err);
    });
}

start();
