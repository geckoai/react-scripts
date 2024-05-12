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
exports.OpenApiPathMethodInfo = void 0;
const class_transformer_1 = require("@geckoai/class-transformer");
const open_api_path_method_parameter_1 = require("../open-api-path-method-parameter");
const typescript_1 = require("typescript");
const path_1 = __importDefault(require("path"));
const utils_1 = require("../../utils");
/**
 * OpenAPI info docs
 */
class OpenApiPathMethodInfo {
    /**
     * createModifiers
     */
    static createModifiers() {
        return [typescript_1.factory.createModifier(typescript_1.SyntaxKind.ExportKeyword)];
    }
    summary;
    description;
    operationId;
    parameters = [];
    /**
     * createDecorators
     * @param url
     * @param method
     */
    createDecorators(url, method) {
        return [
            typescript_1.factory.createDecorator(typescript_1.factory.createCallExpression(typescript_1.factory.createIdentifier('ApiRequest'), undefined, [
                typescript_1.factory.createObjectLiteralExpression([
                    typescript_1.factory.createPropertyAssignment(typescript_1.factory.createIdentifier('url'), typescript_1.factory.createStringLiteral(url)),
                    typescript_1.factory.createPropertyAssignment(typescript_1.factory.createIdentifier('method'), typescript_1.factory.createStringLiteral(method)),
                    typescript_1.factory.createPropertyAssignment(typescript_1.factory.createIdentifier('description'), typescript_1.factory.createStringLiteral(this.description || this.summary)),
                ], true),
            ])),
        ];
    }
    importSource = new Map();
    /**
     * 初始化
     */
    init() {
        const members = this.importSource.get('@geckoai/http') || new Set();
        members.add('ApiRequest');
        this.importSource.set('@geckoai/http', members);
    }
    /**
     * createImportDeclarations
     */
    createImportDeclarations() {
        const list = [];
        this.importSource.forEach((members, source) => {
            list.push(typescript_1.factory.createImportDeclaration(undefined, undefined, typescript_1.factory.createImportClause(false, undefined, typescript_1.factory.createNamedImports(Array.from(members).map((member) => typescript_1.factory.createImportSpecifier(false, undefined, typescript_1.factory.createIdentifier(member))))), typescript_1.factory.createStringLiteral(source)));
        });
        return list;
    }
    /**
     * getMembers
     */
    getMembers() {
        const list = [];
        this.parameters.forEach((x) => {
            if (x.hasType() && !/\./.test(x.name)) {
                if (list.length !== 0) {
                    list.push(utils_1.Utils.createNewLine());
                }
                list.push(x.createDeclaration(this));
            }
        });
        if (list.length) {
            if (this.parameters.length) {
                const members = this.importSource.get('@geckoai/http') || new Set();
                members.add('ApiProperty');
                this.importSource.set('@geckoai/http', members);
            }
        }
        return list;
    }
    /**
     * 创建文件
     * @param url
     * @param method
     * @param name
     * @param dest
     * @param output
     */
    async createFile(url, method, name, dest, output) {
        const fileName = path_1.default.join(dest, utils_1.Utils.getName(name) + '.ts');
        try {
            this.init();
            const tsSourceFile = (0, typescript_1.createSourceFile)(fileName, '', typescript_1.ScriptTarget.Latest);
            const members = this.getMembers();
            const sourceFile = typescript_1.factory.createSourceFile([
                ...this.createImportDeclarations(),
                utils_1.Utils.createNewLine(),
                typescript_1.factory.createClassDeclaration(
                // [],
                this.createDecorators(url, method), OpenApiPathMethodInfo.createModifiers(), name, [], undefined, members),
            ], typescript_1.factory.createToken(typescript_1.SyntaxKind.EndOfFileToken), typescript_1.NodeFlags.None);
            const file = utils_1.Utils.printer.printNode(typescript_1.EmitHint.SourceFile, sourceFile, tsSourceFile);
            await utils_1.Utils.write(fileName, utils_1.Utils.unescape(file));
        }
        catch (e) {
            console.error(`CreateFileError: ${fileName}`);
        }
    }
}
__decorate([
    (0, class_transformer_1.Typed)(),
    __metadata("design:type", String)
], OpenApiPathMethodInfo.prototype, "summary", void 0);
__decorate([
    (0, class_transformer_1.Typed)(),
    __metadata("design:type", String)
], OpenApiPathMethodInfo.prototype, "description", void 0);
__decorate([
    (0, class_transformer_1.Typed)(),
    __metadata("design:type", String)
], OpenApiPathMethodInfo.prototype, "operationId", void 0);
__decorate([
    (0, class_transformer_1.TypedArray)(open_api_path_method_parameter_1.OpenApiPathMethodParameter),
    __metadata("design:type", Array)
], OpenApiPathMethodInfo.prototype, "parameters", void 0);
exports.OpenApiPathMethodInfo = OpenApiPathMethodInfo;
