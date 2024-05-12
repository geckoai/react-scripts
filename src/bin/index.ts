#!/usr/bin/env node
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

import 'reflect-metadata';
import ora from 'ora';
import { spawn } from 'child_process';
import { program } from 'commander';
import chalk from 'chalk';
import path from 'path';
import inquirer from 'inquirer';
import download from 'download-git-repo';
import rimraf from 'rimraf';
import { build } from '../lib/build';
import { setEnv } from '../lib/set-env';
import { install } from '../lib/install';
import { swaggerGenerator } from '../lib/swagger-generator';
import dotenv from 'dotenv';
import { expand } from 'dotenv-expand';

const PACKAGE = require(path.join(__dirname, '../', '../', 'package.json'));

program.version(PACKAGE.version as string, '-v, --version');

program
  .command('start')
  .description('Start react app')
  .option('-M, --max_old_space_size [size]', 'memory limit', '4096')
  .action((option: { max_old_space_size: string }) => {
    expand(dotenv.config());

    setEnv(true);
    const size = Number(option.max_old_space_size);
    if (isNaN(size)) {
      throw new TypeError(
        'The option "max_old_space_size" argument is a number type.'
      );
    }
    if (size <= 0) {
      throw new TypeError(
        'The option "max_old_space_size" argument must be gt 0.'
      );
    }
    if (size % 1024 !== 0) {
      throw new TypeError(
        'The option "max_old_space_size" argument must be multiple of 1024.'
      );
    }

    rimraf.sync(path.resolve('node_modules', '.cache'));
    spawn(
      'node',
      [
        path.join(__dirname, '../', 'lib', 'start.js'),
        `--max_old_space_size=${size}`,
      ],
      {
        stdio: 'inherit',
      }
    );
  });

program
  .command('swagger-generator')
  .description('Build swagger docs')
  .action(async () => {
    await swaggerGenerator();
  });

program
  .command('build')
  .description('Build react app')
  .action(() => {
    rimraf.sync(path.resolve('node_modules', '.cache'));
    require('dotenv').config();
    setEnv();
    build();
  });

program
  .command('create <project-name>')
  .description('Create react app')
  .action((projectName: string) => {
    const spinner = ora('Start download template.');
    download(
      'geckoai/react-app-template',
      path.resolve(projectName),
      async (err: Error) => {
        if (err) {
          spinner.fail(err.message);
          throw err;
        }
        spinner.succeed('Download template success!');
        const { isInstall } = await inquirer.prompt<{ isInstall: boolean }>({
          type: 'confirm',
          name: 'isInstall',
          message: 'Is install dependencies ?',
          default: true,
        });
        if (isInstall) {
          const { select } = await inquirer.prompt<{ select: string }>({
            type: 'list',
            message: 'Select package manager.',
            choices: ['use yarn', 'use npm'],
            default: 0,
            name: 'select',
          });
          try {
            await install(select === 'use yarn' ? 'yarn' : 'npm', projectName);
            spinner.succeed('Install success.');
          } catch (err) {
            spinner.fail('Install fail.');
          }
        }
      }
    );
  });

program.parse(process.argv);

if (process.argv.length <= 2) {
  program.outputHelp((cb) => {
    return chalk.green(cb);
  });
}
