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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const giget_1 = require("giget");
const build_1 = require("../lib/build");
const set_env_1 = require("../lib/set-env");
const install_1 = require("../lib/install");
const swagger_generator_1 = require("../lib/swagger-generator");
const dotenvx_1 = __importDefault(require("@dotenvx/dotenvx"));
const dotenv_expand_1 = require("dotenv-expand");
const fs_1 = __importDefault(require("fs"));
const validate_npm_package_name_1 = __importDefault(require("validate-npm-package-name"));
const process = __importStar(require("node:process"));
const PACKAGE = require(path_1.default.join(__dirname, '../', '../', 'package.json'));
const program = new commander_1.Command();
program.version(PACKAGE.version, '-v, --version');
program
    .command('start')
    .description('Start react app')
    .action(() => {
    process.env.NODE_ENV = 'development';
    (0, dotenv_expand_1.expand)(dotenvx_1.default.config({ path: ['.env.local', '.env.development', '.env'] }));
    (0, set_env_1.setEnv)();
    const size = Number(process.env.MAX_OLD_SPACE_SIZE);
    if (isNaN(size)) {
        throw new TypeError('The option "max_old_space_size" argument is a number type.');
    }
    if (size <= 0) {
        throw new TypeError('The option "max_old_space_size" argument must be gt 0.');
    }
    if (size % 1024 !== 0) {
        throw new TypeError('The option "max_old_space_size" argument must be multiple of 1024.');
    }
    (0, child_process_1.spawn)('node', [
        `--max_old_space_size=${process.env.MAX_OLD_SPACE_SIZE}`,
        path_1.default.join(__dirname, '../', 'lib', 'start.js'),
    ], {
        stdio: 'inherit',
    });
});
program
    .command('swagger-generator')
    .description('Build swagger docs')
    .action(async () => {
    await (0, swagger_generator_1.swaggerGenerator)();
});
program
    .command('build')
    .description('Build react app')
    .action(() => {
    process.env.NODE_ENV = 'production';
    (0, dotenv_expand_1.expand)(dotenvx_1.default.config({
        path: ['.env.local', '.env.production', '.env'],
    }));
    (0, set_env_1.setEnv)();
    (0, build_1.build)();
});
program
    .command('create <project-name>')
    .description('Create react app')
    .action(async (projectName) => {
    const spinner = (0, ora_1.default)('Start download template.').start();
    try {
        const { warnings } = (0, validate_npm_package_name_1.default)(projectName);
        if (warnings?.length) {
            warnings.forEach((x) => {
                console.warn(x);
            });
        }
        await (0, giget_1.downloadTemplate)('github:geckoai/electron-react-app-template', {
            dir: path_1.default.resolve(projectName),
        });
        spinner.succeed('Download template success!');
        const file = fs_1.default.readFileSync(path_1.default.resolve(projectName, 'package.json'), 'utf8');
        const json = JSON.parse(file);
        json.name = projectName;
        const { description } = await inquirer_1.default.prompt({
            type: 'input',
            name: 'description',
            message: 'Please enter project description!',
            default: '',
        });
        json.name = description;
        const { author } = await inquirer_1.default.prompt({
            type: 'input',
            name: 'author',
            message: 'Please enter project author!',
            default: 'mingqi-tech',
        });
        json.author = author;
        const { productName } = await inquirer_1.default.prompt({
            type: 'input',
            name: 'productName',
            message: 'Please enter project productName!',
            default: 'App Name',
        });
        json.build.productName = productName;
        const { appId } = await inquirer_1.default.prompt({
            type: 'input',
            name: 'appId',
            message: 'Please enter project appId!',
            default: 'com.mininglamp.electron.app',
        });
        json.build.appId = appId;
        const { copyright } = await inquirer_1.default.prompt({
            type: 'input',
            name: 'copyright',
            message: 'Please enter project copyright!',
            default: 'Copyright © 2020 mininglamp',
        });
        json.build.copyright = copyright;
        fs_1.default.writeFileSync(path_1.default.resolve(projectName, 'package.json'), JSON.stringify(json, null, 2));
        const { isInstall } = await inquirer_1.default.prompt({
            type: 'confirm',
            name: 'isInstall',
            message: 'Is install dependencies ?',
            default: true,
        });
        if (isInstall) {
            await (0, install_1.install)('pnpm', projectName);
        }
        else {
            console.log(chalk_1.default.green('\nTo get started:'));
            console.log(chalk_1.default.yellow(`cd ${projectName}`));
            console.log(chalk_1.default.yellow('pnpm install'));
            console.log(chalk_1.default.yellow('pnpm start'));
        }
    }
    catch (err) {
        spinner.fail(err?.message);
    }
});
program.parse(process.argv);
if (process.argv.length <= 2) {
    program.outputHelp((cb) => {
        return chalk_1.default.green(cb);
    });
}
