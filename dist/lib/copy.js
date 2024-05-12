"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.copy = void 0;
/**
 * 复制文件
 * @param targetDir 目标目录
 * @param fileNames 文件名称
 * @param dest 保存目录
 */
const constants_1 = require("./constants");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const create_dir_1 = require("./create-dir");
function copy(targetDir, fileNames, dest) {
    const files = fileNames.filter(x => !constants_1.EXCLUDES.find(e => e.test(x)));
    if (files.length) {
        if (!fs_1.default.existsSync(dest)) {
            (0, create_dir_1.createDir)(dest);
        }
        files.forEach(name => {
            const mPath = path_1.default.join(targetDir, name);
            const mDist = path_1.default.join(dest, name);
            const stats = fs_1.default.statSync(mPath);
            if (stats.isFile()) {
                if (!fs_1.default.existsSync(mDist)) {
                    fs_1.default.copyFileSync(mPath, mDist);
                }
            }
            else if (stats.isDirectory()) {
                const strings = fs_1.default.readdirSync(mPath);
                copy(mPath, strings, mDist);
            }
        });
    }
}
exports.copy = copy;
