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
exports.SwaggerGenerator = void 0;
const class_transformer_1 = require("@geckoai/class-transformer");
const swagger_generator_dto_1 = require("../swagger-generator-dto");
const swagger_generator_vo_1 = require("../swagger-generator-vo");
/**
 * 输出信息
 */
class SwaggerGenerator {
    /**
     * 生成文件存储的目录
     */
    dest;
    /**
     * dtos
     */
    dtos = [];
    /**
     * vos
     */
    vos = [];
}
__decorate([
    (0, class_transformer_1.Typed)(),
    __metadata("design:type", String)
], SwaggerGenerator.prototype, "dest", void 0);
__decorate([
    (0, class_transformer_1.TypedArray)(swagger_generator_dto_1.SwaggerGeneratorDto),
    __metadata("design:type", Array)
], SwaggerGenerator.prototype, "dtos", void 0);
__decorate([
    (0, class_transformer_1.TypedArray)(swagger_generator_vo_1.SwaggerGeneratorVo),
    __metadata("design:type", Array)
], SwaggerGenerator.prototype, "vos", void 0);
exports.SwaggerGenerator = SwaggerGenerator;
