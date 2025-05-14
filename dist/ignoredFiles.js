"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ignoredFiles;
const path = require('path');
const escape = require('escape-string-regexp');
function ignoredFiles(appSrc) {
    return new RegExp(`^(?!${escape(path.normalize(appSrc + '/').replace(/[\\]+/g, '/'))}).+/node_modules/`, 'g');
}
