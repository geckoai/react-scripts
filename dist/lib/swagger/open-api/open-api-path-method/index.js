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
exports.OpenApiPathMethod = void 0;
const class_transformer_1 = require("@geckoai/class-transformer");
const open_api_path_method_info_1 = require("../open-api-path-method-info");
/**
 * OpenAPI info docs
 */
class OpenApiPathMethod {
    get;
    post;
    put;
    delete;
}
__decorate([
    (0, class_transformer_1.Typed)(open_api_path_method_info_1.OpenApiPathMethodInfo),
    __metadata("design:type", open_api_path_method_info_1.OpenApiPathMethodInfo)
], OpenApiPathMethod.prototype, "get", void 0);
__decorate([
    (0, class_transformer_1.Typed)(open_api_path_method_info_1.OpenApiPathMethodInfo),
    __metadata("design:type", open_api_path_method_info_1.OpenApiPathMethodInfo)
], OpenApiPathMethod.prototype, "post", void 0);
__decorate([
    (0, class_transformer_1.Typed)(open_api_path_method_info_1.OpenApiPathMethodInfo),
    __metadata("design:type", open_api_path_method_info_1.OpenApiPathMethodInfo)
], OpenApiPathMethod.prototype, "put", void 0);
__decorate([
    (0, class_transformer_1.Typed)(open_api_path_method_info_1.OpenApiPathMethodInfo),
    __metadata("design:type", open_api_path_method_info_1.OpenApiPathMethodInfo)
], OpenApiPathMethod.prototype, "delete", void 0);
exports.OpenApiPathMethod = OpenApiPathMethod;
