#!/usr/bin/env node
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
require("reflect-metadata");
const ora_1 = __importDefault(require("ora"));
const child_process_1 = require("child_process");
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const path_1 = __importDefault(require("path"));
const inquirer_1 = __importDefault(require("inquirer"));
const download_git_repo_1 = __importDefault(require("download-git-repo"));
const rimraf_1 = __importDefault(require("rimraf"));
const build_1 = require("../lib/build");
const set_env_1 = require("../lib/set-env");
const install_1 = require("../lib/install");
const swagger_generator_1 = require("../lib/swagger-generator");
const dotenv_1 = __importDefault(require("dotenv"));
const dotenv_expand_1 = require("dotenv-expand");
const PACKAGE = require(path_1.default.join(__dirname, '../', '../', 'package.json'));
commander_1.program.version(PACKAGE.version, '-v, --version');
commander_1.program
    .command('start')
    .description('Start react app')
    .option('-M, --max_old_space_size [size]', 'memory limit', '4096')
    .action((option) => {
    (0, dotenv_expand_1.expand)(dotenv_1.default.config());
    (0, set_env_1.setEnv)(true);
    const size = Number(option.max_old_space_size);
    if (isNaN(size)) {
        throw new TypeError('The option "max_old_space_size" argument is a number type.');
    }
    if (size <= 0) {
        throw new TypeError('The option "max_old_space_size" argument must be gt 0.');
    }
    if (size % 1024 !== 0) {
        throw new TypeError('The option "max_old_space_size" argument must be multiple of 1024.');
    }
    rimraf_1.default.sync(path_1.default.resolve('node_modules', '.cache'));
    (0, child_process_1.spawn)('node', [
        `--max_old_space_size=${size}`,
        path_1.default.join(__dirname, '../', 'lib', 'start.js'),
    ], {
        stdio: 'inherit',
    });
});
commander_1.program
    .command('swagger-generator')
    .description('Build swagger docs')
    .action(async () => {
    await (0, swagger_generator_1.swaggerGenerator)();
});
commander_1.program
    .command('build')
    .description('Build react app')
    .action(() => {
    rimraf_1.default.sync(path_1.default.resolve('node_modules', '.cache'));
    require('dotenv').config();
    (0, set_env_1.setEnv)();
    (0, build_1.build)();
});
commander_1.program
    .command('create <project-name>')
    .description('Create react app')
    .action((projectName) => {
    const spinner = (0, ora_1.default)('Start download template.');
    (0, download_git_repo_1.default)('geckoai/react-app-template', path_1.default.resolve(projectName), async (err) => {
        if (err) {
            spinner.fail(err.message);
            throw err;
        }
        spinner.succeed('Download template success!');
        const { isInstall } = await inquirer_1.default.prompt({
            type: 'confirm',
            name: 'isInstall',
            message: 'Is install dependencies ?',
            default: true,
        });
        if (isInstall) {
            const { select } = await inquirer_1.default.prompt({
                type: 'list',
                message: 'Select package manager.',
                choices: ['use yarn', 'use npm'],
                default: 0,
                name: 'select',
            });
            try {
                await (0, install_1.install)(select === 'use yarn' ? 'yarn' : 'npm', projectName);
                spinner.succeed('Install success.');
            }
            catch (err) {
                spinner.fail('Install fail.');
            }
        }
    });
});
commander_1.program.parse(process.argv);
if (process.argv.length <= 2) {
    commander_1.program.outputHelp((cb) => {
        return chalk_1.default.green(cb);
    });
}
