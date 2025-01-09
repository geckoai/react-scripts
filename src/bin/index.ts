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
import { Command } from 'commander';
import chalk from 'chalk';
import path from 'path';
import inquirer from 'inquirer';
import { build } from '../lib/build';
import { setEnv } from '../lib/set-env';
import { install } from '../lib/install';
import { swaggerGenerator } from '../lib/swagger-generator';
import dotenv from '@dotenvx/dotenvx';
import { expand } from 'dotenv-expand';
import { downloadTemplate } from 'giget';
import fs from 'fs';
import { checkLocalEnv } from '../lib/check';
import * as process from 'node:process';

const PACKAGE = require(path.join(__dirname, '../', '../', 'package.json'));

const program = new Command();

program.version(PACKAGE.version as string, '-v, --version');

program
  .command('start')
  .description('Start react app')
  .argument(
    '[env]',
    'Set which custom env file to use, for example, test will use. env. test',
    'development'
  )
  .action((env) => {
    checkLocalEnv();
    expand(
      dotenv.config({
        path: ['local', env]
          .filter(Boolean)
          .map((e: string) => `.env.${e}`)
          .concat('.env'),
        processEnv: { ...process.env } as any,
      })
    );
    setEnv('development');
    const size = Number(process.env.MAX_OLD_SPACE_SIZE);
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
    spawn(
      'node',
      [
        `--max_old_space_size=${process.env.MAX_OLD_SPACE_SIZE}`,
        path.join(__dirname, '../', 'lib', 'start.js'),
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
  .argument(
    '[env]',
    'Set which custom env file to use, for example, test will use. env. test',
    'production'
  )
  .action((env) => {
    checkLocalEnv();
    dotenv.config({
      path: ['local', env]
        .filter(Boolean)
        .map((e: string) => `.env.${e}`)
        .concat('.env'),
      processEnv: { ...process.env } as any,
    });
    setEnv('production');
    build();
  });

program
  .command('create <project-name>')
  .description('Create react app')
  .action(async (projectName: string) => {
    const spinner = ora('Start download template.').start();

    try {
      await downloadTemplate('gh:geckoai/react-app-template', {
        dir: path.join(process.cwd(), projectName),
      });
      spinner.succeed('Download template success!');

      const file = fs.readFileSync(
        path.resolve(projectName, 'package.json'),
        'utf8'
      );

      const json = JSON.parse(file);
      json.name = projectName;

      const { description } = await inquirer.prompt({
        type: 'input',
        name: 'description',
        message: 'Please enter project description!',
        default: '',
      });
      json.name = description;

      const { author } = await inquirer.prompt({
        type: 'input',
        name: 'author',
        message: 'Please enter project author!',
        default: 'mingqi-tech',
      });
      json.author = author;

      fs.writeFileSync(
        path.resolve(projectName, 'package.json'),
        JSON.stringify(json, null, 2)
      );

      const { isInstall } = await inquirer.prompt({
        type: 'confirm',
        name: 'isInstall',
        message: 'Is install dependencies ?',
        default: true,
      });

      if (isInstall) {
        await install('pnpm', projectName);
      } else {
        console.log(chalk.green('\nTo get started:'));
        console.log(chalk.yellow(`cd ${projectName}`));
        console.log(chalk.yellow('pnpm install'));
        console.log(chalk.yellow('pnpm start'));
      }
    } catch (err: any) {
      spinner.fail(err?.message);
    }
  });

program.parse(process.argv);

if (process.argv.length <= 2) {
  program.outputHelp((cb) => {
    return chalk.green(cb);
  });
}
