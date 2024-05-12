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
exports.Utils = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const inquirer_1 = __importDefault(require("inquirer"));
const typescript_1 = __importStar(require("typescript"));
const chalk_1 = __importDefault(require("chalk"));
/**
 * 工具包
 */
class Utils {
    /**
     * 创建一个空行
     */
    static createNewLine() {
        return typescript_1.factory.createIdentifier('\n');
    }
    /**
     * unicode转汉字
     * @param input
     * @private
     */
    static unescape(input) {
        const regexp = /\\u[\w\d]{4}/g;
        let str = input, exec = null;
        do {
            exec = regexp.exec(input);
            if (exec) {
                str = str.replace(exec[0], unescape(exec[0].replace('\\u', '%u')));
            }
        } while (exec);
        return str;
    }
    /**
     * 创建文件夹
     * @param fileName
     * @private
     */
    static createDir(fileName) {
        let pathName = path_1.default.dirname(fileName);
        const dirs = [];
        while (pathName && !fs_1.default.existsSync(pathName)) {
            dirs.push(pathName);
            pathName = path_1.default.dirname(pathName);
        }
        dirs.reverse().forEach((o) => {
            fs_1.default.mkdirSync(o);
        });
    }
    /**
     * 获取文件名称
     * @param n
     */
    static getName(n) {
        return n
            .split('<')[0]
            .split('')
            .map((x, i, array) => {
            if (/[A-Z]/.test(x)) {
                if (/[A-Z]/.test(array[i + 1])) {
                    return x.toLowerCase();
                }
                return (i === 0 ? '' : '-') + x.toLowerCase();
            }
            if (/\//.test(x)) {
                return '-';
            }
            if (/\{/.test(x)) {
                return '';
            }
            if (/\}/.test(x)) {
                return '';
            }
            return x;
        })
            .join('');
    }
    static overwrite = 1;
    /**
     * typescript printer
     */
    static printer = (0, typescript_1.createPrinter)({
        removeComments: false,
        newLine: typescript_1.NewLineKind.LineFeed,
    });
    /**
     * 生成文件
     * @param fileName
     * @param file
     */
    static async write(fileName, file) {
        try {
            const isExists = fs_1.default.existsSync(fileName);
            if (isExists) {
                if (Utils.overwrite !== 2 && Utils.overwrite !== 4) {
                    const { overwrite } = await inquirer_1.default.prompt([
                        {
                            type: 'rawlist',
                            message: '当前文件已存在，是否覆盖文件，输入数字继续',
                            name: 'overwrite',
                            choices: [
                                {
                                    key: 1,
                                    name: '覆盖当前',
                                    value: 1,
                                },
                                {
                                    key: 2,
                                    name: '覆盖所有',
                                    value: 2,
                                },
                                {
                                    key: 3,
                                    name: '跳过当前',
                                    value: 3,
                                },
                                {
                                    key: 4,
                                    name: '跳过所有',
                                    value: 4,
                                },
                            ],
                        },
                    ]);
                    Utils.overwrite = overwrite;
                }
            }
            const isOverwriteAll = isExists && Utils.overwrite === 2;
            const isOverwriteCurrent = isExists && Utils.overwrite === 1;
            if (!isExists || isOverwriteAll || isOverwriteCurrent) {
                Utils.createDir(fileName);
                if (process.env.OAS_FILE_TYPE) {
                    fileName = fileName.replace(/\.ts$/, '.js');
                    const readConfigFile = typescript_1.default.readConfigFile(path_1.default.resolve('tsconfig.json'), typescript_1.default.sys.readFile);
                    fs_1.default.writeFileSync(fileName, typescript_1.default.transpile(file, {
                        ...readConfigFile.config.compilerOptions,
                        noEmit: true,
                        declaration: true,
                        removeComments: false,
                        moduleResolution: 'classic',
                    }));
                }
                else {
                    fs_1.default.writeFileSync(fileName, file);
                }
                console.log(chalk_1.default.green('WriteFileSuccess'), ': ', chalk_1.default.gray(fileName));
            }
            else {
                console.log(chalk_1.default.yellow('WriteFileSkip' + ''), ': ', chalk_1.default.gray(fileName));
            }
        }
        catch (e) {
            console.log(chalk_1.default.red('WriteFileError'), ': ', chalk_1.default.gray(fileName));
        }
    }
}
exports.Utils = Utils;
