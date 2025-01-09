"use strict";
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
exports.install = void 0;
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const child_process_1 = require("child_process");
const process = __importStar(require("node:process"));
/**
 * 安装依赖
 * @param type
 * @param projectName
 */
function install(type, projectName) {
    return new Promise((r, j) => {
        const npmi = (0, child_process_1.spawn)(process.platform === 'win32' ? type + '.cmd' : type, ['install'], process.platform === 'win32'
            ? {
                cwd: path_1.default.resolve(projectName),
                stdio: 'inherit',
                env: process.env,
                shell: true,
            }
            : {
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
