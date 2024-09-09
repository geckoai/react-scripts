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

/**
 * 设置默认环境变量
 */
export function setEnv(): void {
  process.env.PUBLIC_URL = process.env.PUBLIC_URL ?? '/';
  process.env.MAX_OLD_SPACE_SIZE = process.env.MAX_OLD_SPACE_SIZE ?? '4096';
  process.env.HOST = process.env.HOST ?? '127.0.0.1';
  process.env.PORT = process.env.PORT ?? '3000';
  process.env.WDS_SOCKET_HOST = process.env.WDS_SOCKET_HOST ?? process.env.HOST;
  process.env.WDS_SOCKET_PORT = process.env.WDS_SOCKET_PORT ?? process.env.PORT;
  process.env.WDS_SOCKET_PATH = process.env.WDS_SOCKET_PATH ?? '/ws';
  process.env.APP_RUNTIME_ENV = process.env.APP_RUNTIME_ENV ?? 'web';
  process.env.NODE_ENV = process.env.NODE_ENV ?? 'development';
}
