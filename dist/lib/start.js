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
const constants_1 = require("./constants");
const copy_1 = require("./copy");
const isInteractive = process.stdout.isTTY;
const openBrowser = require('react-dev-utils/openBrowser');
const { webpackConfig, ServerConfiguration } = require('../webpack.config');
const compiler = (0, webpack_1.webpack)(webpackConfig);
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
if (webpackConfig) {
    if (webpackConfig.externals && webpackConfig.externalsType !== 'script') {
        try {
            console.log(`Copy externals files from ${constants_1.PACKAGE_DIR} to ${constants_1.DIST_DIR}`);
            const strings = Object.keys(webpackConfig.externals);
            (0, copy_1.copy)(constants_1.PACKAGE_DIR, strings, constants_1.DIST_DIR);
        }
        catch (e) {
            console.error(e);
        }
    }
}
const server = new webpack_dev_server_1.default(ServerConfiguration, compiler);
const port = server.options.port || 3000;
server.options.open = false;
const protocol = (server.options.server || { type: 'http' }).type || 'http';
const address = ip_1.default.address();
const PACK = require(path_1.default.resolve('package.json'));
compiler.hooks.done.tap('done', (stats) => {
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
server.startCallback(() => {
    if (isInteractive) {
        (0, clear_console_1.clearConsole)();
    }
    console.log(chalk_1.default.cyan('Starting the development server...\n'));
    openBrowser(`${protocol}://localhost:${port}`);
});
process.on('SIGINT', function () {
    server.stopCallback();
    process.exit();
});
process.on('SIGTERM', function () {
    server.stopCallback();
    process.exit();
});
