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
exports.build = void 0;
const webpack_1 = require("webpack");
const rimraf_1 = __importDefault(require("rimraf"));
const path_1 = __importDefault(require("path"));
const constants_1 = require("./constants");
const copy_1 = require("./copy");
/**
 * build
 */
function build() {
    rimraf_1.default.sync(path_1.default.resolve('dist'));
    const { webpackConfig } = require('../webpack.config');
    if (webpackConfig) {
        if (webpackConfig.externals) {
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
    const compiler = (0, webpack_1.webpack)(webpackConfig);
    compiler.run((err, status) => {
        if (err) {
            console.log(err);
        }
        else if (status) {
            console.log(status.toString({
                all: false,
                builtAt: true,
                warnings: true,
                errors: true,
            }));
        }
    });
}
exports.build = build;
