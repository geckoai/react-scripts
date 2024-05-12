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
exports.OpenApiDefinition = void 0;
const class_transformer_1 = require("@geckoai/class-transformer");
const open_api_definition_property_1 = require("../open-api-definition-property");
const path_1 = __importDefault(require("path"));
const utils_1 = require("../../utils");
const typescript_1 = require("typescript");
/**
 * 输出信息
 */
class OpenApiDefinition {
    /**
     * createModifiers
     */
    static createModifiers() {
        return [typescript_1.factory.createModifier(typescript_1.SyntaxKind.ExportKeyword)];
    }
    type;
    title;
    properties = new Map();
    importSource = new Map();
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
    getMembers(output) {
        const list = [];
        this.properties.forEach((x, name) => {
            if (list.length !== 0) {
                list.push(utils_1.Utils.createNewLine());
            }
            list.push(x.createDeclaration(name, this, output));
        });
        return list;
    }
    /**
     * 创建文件
     * @param name
     * @param dest
     * @param output
     */
    async createFile(name, dest, output) {
        const fileName = path_1.default.join(dest, utils_1.Utils.getName(name) + '.ts');
        const tsSourceFile = (0, typescript_1.createSourceFile)(fileName, '', typescript_1.ScriptTarget.Latest);
        const members = this.getMembers(output);
        const sourceFile = typescript_1.factory.createSourceFile([
            ...this.createImportDeclarations(),
            utils_1.Utils.createNewLine(),
            typescript_1.factory.createClassDeclaration([], OpenApiDefinition.createModifiers(), name, [], undefined, members),
        ], typescript_1.factory.createToken(typescript_1.SyntaxKind.EndOfFileToken), typescript_1.NodeFlags.None);
        const file = utils_1.Utils.printer.printNode(typescript_1.EmitHint.SourceFile, sourceFile, tsSourceFile);
        await utils_1.Utils.write(fileName, utils_1.Utils.unescape(file));
    }
}
__decorate([
    (0, class_transformer_1.Typed)(),
    __metadata("design:type", String)
], OpenApiDefinition.prototype, "type", void 0);
__decorate([
    (0, class_transformer_1.Typed)(),
    __metadata("design:type", String)
], OpenApiDefinition.prototype, "title", void 0);
__decorate([
    (0, class_transformer_1.TypedMap)(open_api_definition_property_1.OpenApiDefinitionProperty, {
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
], OpenApiDefinition.prototype, "properties", void 0);
exports.OpenApiDefinition = OpenApiDefinition;
