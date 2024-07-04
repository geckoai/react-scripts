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

declare interface CustomConfig {
  webpack?: {};
  style?: {
    css?: {};
    postcss?: {};
    less?: {};
    scss?: {};
  };
  babel?: {};
  bundleAnalyzer?: {};
  ts?: {};
  eslint?: {};
  styleLint?: {};
  file?: {};
  devServer?: {};
  alias?: {};
  swaggers?: Swagger[];
}

declare interface Swagger {
  /**
   * Swagger openapi 地址
   */
  url: string;
  outputs: SwaggerGenerator[];
}

declare interface SwaggerGenerator {
  /**
   * 生成文件存储的目录
   */
  dest: string;
  dtos: SwaggerGeneratorDto[];
  vos: SwaggerGeneratorVo[];
}

declare interface SwaggerGeneratorDto {
  /**
   * 对应的path
   */
  path: string;
  /**
   * 对应的method
   */
  method: string;
  /**
   * 输出的名称
   */
  name?: string;
}

declare interface SwaggerGeneratorVo {
  /**
   * 目标模型
   */
  target: string;
  /**
   * 生成的名称
   */
  name?: string;
}
