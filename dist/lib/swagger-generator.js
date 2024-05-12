"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerGenerator = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const utils_1 = require("../utils");
const swagger_1 = require("./swagger/swagger");
/**
 * 编译swagger api文件
 */
async function swaggerGenerator() {
    if (fs_1.default.existsSync(path_1.default.resolve('project.config.js'))) {
        const config = require(path_1.default.resolve('project.config.js'));
        if (config && Array.isArray(config.swaggers)) {
            const swaggers = config.swaggers.map((x) => utils_1.transformer.transform(swagger_1.Swagger, x));
            for (const swagger of swaggers) {
                const res = await swagger.loadFile();
                const outputs = swagger.outputs;
                for (const output of outputs) {
                    for (const dto of output.dtos) {
                        const pathMethod = res.paths.get(dto.path);
                        if (pathMethod) {
                            const pathMethodInfo = pathMethod[dto.method];
                            if (pathMethodInfo) {
                                await pathMethodInfo.createFile((res.basePath || '') + dto.path, dto.method, dto.name, output.dest, output);
                            }
                        }
                    }
                    for (const vo of output.vos) {
                        let definition = undefined;
                        if (res.definitions) {
                            definition = res.definitions.get(vo.target);
                        }
                        if (res.components) {
                            definition = res.components.get(vo.target);
                        }
                        if (definition) {
                            await definition.createFile(vo.name || definition.title, output.dest, output);
                        }
                    }
                }
            }
        }
    }
}
exports.swaggerGenerator = swaggerGenerator;
