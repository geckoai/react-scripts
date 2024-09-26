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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Swagger = void 0;
const swagger_generator_1 = require("./swagger-generator");
const axios_1 = __importDefault(require("axios"));
const utils_1 = require("../../utils");
const open_api_1 = require("./open-api");
const class_transformer_1 = require("@geckoai/class-transformer");
/**
 * Swagger
 */
class Swagger {
    url;
    outputs = [];
    /**
     * 加载配置文件
     */
    async loadFile() {
        try {
            const res = await axios_1.default.get(this.url);
            return utils_1.transformer.transform(open_api_1.OpenApi, res.data);
        }
        catch (e) {
            throw new Error(`The file url: ${this.url} load final.`);
        }
    }
}
__decorate([
    (0, class_transformer_1.Typed)(),
    __metadata("design:type", String)
], Swagger.prototype, "url", void 0);
__decorate([
    (0, class_transformer_1.TypedArray)(swagger_generator_1.SwaggerGenerator),
    __metadata("design:type", Array)
], Swagger.prototype, "outputs", void 0);
exports.Swagger = Swagger;
