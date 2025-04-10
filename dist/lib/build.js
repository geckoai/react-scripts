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
exports.build = void 0;
const webpack_1 = require("webpack");
const rimraf_1 = __importDefault(require("rimraf"));
const path_1 = __importDefault(require("path"));
const ora_1 = __importDefault(require("ora"));
const process = __importStar(require("node:process"));
function buildRendererBundle() {
    const spinner = (0, ora_1.default)('[UI:Process] start build. \n').start();
    const { webpackRendererConfig } = require('../webpack.renderer.config');
    const compiler = (0, webpack_1.webpack)(webpackRendererConfig);
    return new Promise((resolve, reject) => {
        compiler.run((err, status) => {
            if (err) {
                reject(err);
            }
            if (status && status.hasErrors()) {
                console.log(status.toString());
            }
        });
        compiler.hooks.afterEmit.tap('ElectronRendererDone', () => {
            resolve();
            spinner.succeed('[UI:Process] finish.');
        });
        compiler.hooks.failed.tap('ElectronMainFailed', (params) => {
            spinner.fail('[UI:Process] error.');
            console.log(params);
            reject();
        });
    });
}
function buildMainBundle() {
    if (process.env.APP_RUNTIME_ENV === 'web') {
        return Promise.resolve();
    }
    const spinner = (0, ora_1.default)('[Main:Process] start build. \n').start();
    return new Promise((r, j) => {
        const { mainConfig } = require('../webpack.main.config');
        const compiler = (0, webpack_1.webpack)(mainConfig);
        compiler.run((err, stats) => {
            if (err) {
                j(err);
            }
            if (stats && stats.hasErrors()) {
                console.log(stats.toString());
            }
        });
        compiler.hooks.afterEmit.tap('ElectronMainDone', () => {
            spinner.succeed('[Main:Process] finish.');
            r(true);
        });
        compiler.hooks.failed.tap('ElectronMainFailed', (params) => {
            spinner.fail('[Main:Process] error.');
            console.log(params);
            j();
        });
    });
}
function build() {
    if (process.env.APP_RUNTIME_ENV === 'electron') {
        rimraf_1.default.sync(path_1.default.resolve('build'));
    }
    if (process.env.APP_RUNTIME_ENV === 'web') {
        rimraf_1.default.sync(path_1.default.resolve('dist'));
    }
    Promise.all([buildMainBundle(), buildRendererBundle()]).catch((err) => {
        console.log(err);
    });
}
exports.build = build;
