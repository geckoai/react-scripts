"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setEnv = void 0;
function setEnv() {
    process.env.PUBLIC_URL = process.env.PUBLIC_URL ?? '/';
    process.env.APP_RUNTIME_ENV = process.env.APP_RUNTIME_ENV ?? 'electron';
    process.env.MAX_OLD_SPACE_SIZE = process.env.MAX_OLD_SPACE_SIZE ?? '4096';
    process.env.HOST = process.env.HOST ?? '127.0.0.1';
    process.env.PORT = process.env.PORT ?? '3000';
    process.env.WDS_SOCKET_HOST = process.env.WDS_SOCKET_HOST ?? process.env.HOST;
    process.env.WDS_SOCKET_PORT = process.env.WDS_SOCKET_PORT ?? process.env.PORT;
    process.env.WDS_SOCKET_PATH = process.env.WDS_SOCKET_PATH ?? '/ws';
    process.env.APP_RUNTIME_ENV = process.env.APP_RUNTIME_ENV ?? 'electron';
}
exports.setEnv = setEnv;
