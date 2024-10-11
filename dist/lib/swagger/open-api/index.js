"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenApi = void 0;
const class_transformer_1 = require("@geckoai/class-transformer");
const open_api_info_1 = require("./open-api-info");
const open_api_path_method_1 = require("./open-api-path-method");
const open_api_definition_1 = require("./open-api-definition");
/**
 * OpenAPI Docs
 */
class OpenApi {
    swagger;
    openapi;
    info;
    basePath;
    paths;
    definitions;
    components;
}
__decorate([
    (0, class_transformer_1.Typed)(String),
    __metadata("design:type", String)
], OpenApi.prototype, "swagger", void 0);
__decorate([
    (0, class_transformer_1.Typed)(String),
    __metadata("design:type", String)
], OpenApi.prototype, "openapi", void 0);
__decorate([
    (0, class_transformer_1.Typed)(open_api_info_1.OpenApiInfo),
    __metadata("design:type", open_api_info_1.OpenApiInfo)
], OpenApi.prototype, "info", void 0);
__decorate([
    (0, class_transformer_1.Typed)(),
    __metadata("design:type", String)
], OpenApi.prototype, "basePath", void 0);
__decorate([
    (0, class_transformer_1.TypedMap)(open_api_path_method_1.OpenApiPathMethod, {
        transform: (values) => {
            const map = new Map();
            if (values !== null && typeof values === 'object') {
                Object.keys(values).forEach((key) => {
                    map.set(key, values[key]);
                });
            }
            return map;
        },
    }),
    __metadata("design:type", Map)
], OpenApi.prototype, "paths", void 0);
__decorate([
    (0, class_transformer_1.TypedMap)(open_api_definition_1.OpenApiDefinition, {
        transform: (values) => {
            if (values !== null && typeof values === 'object') {
                const map = new Map();
                Object.keys(values).forEach((key) => {
                    map.set(key, values[key]);
                });
                return map;
            }
            return undefined;
        },
    }),
    __metadata("design:type", Map)
], OpenApi.prototype, "definitions", void 0);
__decorate([
    (0, class_transformer_1.TypedMap)(open_api_definition_1.OpenApiDefinition, {
        transform: (components) => {
            if (components && components.schemas) {
                const values = components.schemas;
                if (values !== null && typeof values === 'object') {
                    const map = new Map();
                    Object.keys(values).forEach((key) => {
                        map.set(key, values[key]);
                    });
                    return map;
                }
            }
            return undefined;
        },
    }),
    __metadata("design:type", Map)
], OpenApi.prototype, "components", void 0);
exports.OpenApi = OpenApi;
