"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDir = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function createDir(dir) {
    const list = [];
    while (!fs_1.default.existsSync(dir)) {
        list.push(dir);
        dir = path_1.default.dirname(dir);
    }
    list.reverse().forEach(x => fs_1.default.mkdirSync(x));
}
exports.createDir = createDir;
