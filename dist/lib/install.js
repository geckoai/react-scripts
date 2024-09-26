"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.install = void 0;
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const child_process_1 = require("child_process");
/**
 * 安装依赖
 * @param type
 * @param projectName
 */
function install(type, projectName) {
    return new Promise((r, j) => {
        const npmi = (0, child_process_1.spawn)(type + '.cmd', ['install'], {
            cwd: path_1.default.resolve(projectName),
            stdio: 'inherit',
            env: process.env,
        });
        npmi.on('close', () => {
            r();
            console.log(chalk_1.default.green('\nTo get started:'));
            console.log(chalk_1.default.yellow(`cd ${projectName}`));
            console.log(chalk_1.default.yellow(`${type} start`));
        });
        npmi.on('error', (err) => {
            console.log(err);
            j(err);
        });
    });
}
exports.install = install;
