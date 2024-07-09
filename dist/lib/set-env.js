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
Object.defineProperty(exports, "__esModule", { value: true });
exports.setEnv = void 0;
/**
 * 设置默认环境变量
 * @param isDev
 */
function setEnv(isDev) {
    if (process.env.PUBLIC_URL === undefined) {
        process.env.PUBLIC_URL = '/';
    }
    if (process.env.HOST === undefined) {
        process.env.HOST = '0.0.0.0';
    }
    if (process.env.PORT === undefined) {
        process.env.HOST = '3000';
    }
    if (process.env.WDS_SOCKET_HOST === undefined) {
        process.env.WDS_SOCKET_HOST = process.env.HOST;
    }
    if (process.env.WDS_SOCKET_PORT === undefined) {
        process.env.WDS_SOCKET_PORT = process.env.PORT;
    }
    if (process.env.WDS_SOCKET_PATH === undefined) {
        process.env.WDS_SOCKET_PATH = '/ws';
    }
    if (process.env.APP_RUNTIME_ENV === undefined) {
        process.env.APP_RUNTIME_ENV = '';
    }
    if (process.env.MAX_OLD_SPACE_SIZE === undefined) {
        process.env.MAX_OLD_SPACE_SIZE = '4096';
    }
    process.env.NODE_ENV = isDev ? 'development' : 'production';
}
exports.setEnv = setEnv;
