"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const webpack_1 = require("webpack");
const webpack_dev_server_1 = __importDefault(require("webpack-dev-server"));
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const clear_console_1 = require("./clear-console");
const ip_1 = __importDefault(require("ip"));
const child_process_1 = require("child_process");
const electron = require('electron');
const openBrowser = require('react-dev-utils/openBrowser');
const isInteractive = process.stdout.isTTY;
let mainProcess;
let electronRestart = false;
function runRendererBundle() {
    const { webpackRendererConfig, ServerConfiguration, } = require('../webpack.renderer.config');
    const compiler = (0, webpack_1.webpack)(webpackRendererConfig);
    compiler.hooks.invalid.tap('invalid', () => {
        if (isInteractive) {
            (0, clear_console_1.clearConsole)();
        }
    });
    compiler.hooks.beforeCompile.tap('beforeCompile', () => {
        if (isInteractive) {
            (0, clear_console_1.clearConsole)();
            console.log('Compiling...');
        }
    });
    const server = new webpack_dev_server_1.default(ServerConfiguration, compiler);
    const port = server.options.port || 3000;
    server.options.open = false;
    const protocol = (server.options.server || { type: 'http' }).type || 'http';
    const address = ip_1.default.address();
    const PACK = require(path_1.default.resolve('package.json'));
    compiler.hooks.done.tap('ElectronRendererDone', (stats) => {
        if (isInteractive) {
            (0, clear_console_1.clearConsole)();
            if (!stats.hasErrors() && !stats.hasWarnings()) {
                console.log(chalk_1.default.green('Compiled successfully!'));
                console.log(`You can now view ${PACK.name} in the browser.\n`);
                console.log(`Local:            ${protocol}://localhost:${port}`);
                console.log(`On Your Network:  ${protocol}://${address}:${port}\n`);
                console.log('Note that the development build is not optimized.');
                console.log(`To create a production build, use ${chalk_1.default.cyan('yarn build.')}`);
            }
            else {
                console.log(stats.toString({
                    all: false,
                    errors: true,
                    warnings: true,
                    colors: true,
                }));
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
        server.startCallback((err) => {
            if (err) {
                reject();
            }
            if (isInteractive) {
                (0, clear_console_1.clearConsole)();
            }
            console.log(chalk_1.default.cyan('Starting the development server...\n'));
            if (process.env.APP_RUNTIME_ENV === 'web') {
                openBrowser(`${protocol}://localhost:${port}`);
            }
            resolve();
        });
    });
}
function runMainBundle() {
    if (process.env.APP_RUNTIME_ENV === 'web') {
        return Promise.resolve();
    }
    const { mainConfig } = require('../webpack.main.config');
    const compiler = (0, webpack_1.webpack)(mainConfig);
    return new Promise((resolve, reject) => {
        compiler.watch({}, (err, stats) => {
            if (err) {
                reject();
            }
            if (stats && (stats.hasErrors() || stats.hasWarnings())) {
                console.log(stats.toString({
                    all: false,
                    errors: true,
                    warnings: true,
                    colors: true,
                }));
                return;
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
            resolve();
        });
    });
}
function startElectron() {
    if (process.env.APP_RUNTIME_ENV === 'web') {
        return;
    }
    mainProcess = (0, child_process_1.spawn)(electron, [
        path_1.default.resolve('node_modules', '.electron', 'main.js'),
    ]);
    mainProcess.stdout.pipe(process.stdout);
    mainProcess.on('close', () => {
        if (!electronRestart) {
            process.exit();
        }
    });
}
function start() {
    Promise.all([runMainBundle(), runRendererBundle()])
        .then(() => {
        startElectron();
    })
        .catch((err) => {
        console.log(err);
    });
}
start();
