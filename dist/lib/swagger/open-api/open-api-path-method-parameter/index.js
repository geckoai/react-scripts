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
exports.OpenApiPathMethodParameter = void 0;
const class_transformer_1 = require("@geckoai/class-transformer");
const open_api_items_1 = require("../open-api-items");
const typescript_1 = require("typescript");
/**
 * OpenAPI info docs
 */
class OpenApiPathMethodParameter {
    name;
    in;
    description;
    required;
    type;
    style;
    format;
    enum;
    items;
    schema;
    /**
     * 检测是否包含类型
     */
    hasType() {
        return Boolean(this.type) || Boolean(this.items) || Boolean(this.schema);
    }
    /**
     * 获取类型
     */
    getType() {
        if (this.type) {
            return this.type;
        }
        if (this.schema && this.schema.type) {
            return this.schema.type;
        }
    }
    /**
     * docrators
     */
    createDecorators(info) {
        const assignmenets = [];
        const members = info.importSource.get('@geckoai/class-transformer') || new Set();
        if (this.format) {
            assignmenets.push(typescript_1.factory.createPropertyAssignment(typescript_1.factory.createIdentifier('format'), typescript_1.factory.createStringLiteral(this.format)));
        }
        const list = [
            typescript_1.factory.createDecorator(typescript_1.factory.createCallExpression(typescript_1.factory.createIdentifier('ApiProperty'), undefined, [
                typescript_1.factory.createObjectLiteralExpression([
                    typescript_1.factory.createPropertyAssignment(typescript_1.factory.createIdentifier('required'), this.required ? typescript_1.factory.createTrue() : typescript_1.factory.createFalse()),
                    typescript_1.factory.createPropertyAssignment(typescript_1.factory.createIdentifier('description'), typescript_1.factory.createStringLiteral(this.description || '')),
                    typescript_1.factory.createPropertyAssignment(typescript_1.factory.createIdentifier('in'), typescript_1.factory.createStringLiteral(this.in)),
                    typescript_1.factory.createPropertyAssignment(typescript_1.factory.createIdentifier('type'), typescript_1.factory.createStringLiteral(this.getType() || '')),
                    ...assignmenets,
                ], true),
            ])),
        ];
        if (this.type === 'array') {
            const args = [];
            let type = '';
            if (this.items && this.items.type) {
                type = this.items.type;
            }
            if (this.schema && this.schema.type) {
                type = this.schema.type;
            }
            if (type) {
                if (type === 'string') {
                    args.push(typescript_1.factory.createIdentifier('String'));
                }
                if (type === 'boolean') {
                    args.push(typescript_1.factory.createIdentifier('Boolean'));
                }
                if (/(integer|number|float|double)/.test(type)) {
                    args.push(typescript_1.factory.createIdentifier('Number'));
                }
                const properties = [];
                if (this.required) {
                    properties.push(typescript_1.factory.createPropertyAssignment(typescript_1.factory.createIdentifier('required'), typescript_1.factory.createTrue()));
                }
                if (this.enum) {
                    properties.push(typescript_1.factory.createPropertyAssignment(typescript_1.factory.createIdentifier('elementRules'), typescript_1.factory.createObjectLiteralExpression([
                        typescript_1.factory.createPropertyAssignment('type', typescript_1.factory.createStringLiteral('Enum')),
                        typescript_1.factory.createPropertyAssignment('enums', typescript_1.factory.createArrayLiteralExpression(this.enum.map((x) => typescript_1.factory.createStringLiteral(x)), true)),
                    ], true)));
                }
                if (properties.length) {
                    args.push(typescript_1.factory.createObjectLiteralExpression(properties, true));
                }
                members.add('TypedArray');
                list.push(typescript_1.factory.createDecorator(typescript_1.factory.createCallExpression(typescript_1.factory.createIdentifier('TypedArray'), undefined, args)));
            }
        }
        else {
            const args = [];
            if (this.type) {
                if (this.type === 'string') {
                    args.push(typescript_1.factory.createIdentifier('String'));
                }
                if (this.type === 'boolean') {
                    args.push(typescript_1.factory.createIdentifier('Boolean'));
                }
                if (/(integer|number|float|double)/.test(this.type)) {
                    args.push(typescript_1.factory.createIdentifier('Number'));
                }
            }
            const properties = [];
            if (this.required) {
                properties.push(typescript_1.factory.createPropertyAssignment(typescript_1.factory.createIdentifier('required'), typescript_1.factory.createTrue()));
            }
            if (this.enum) {
                properties.push(typescript_1.factory.createPropertyAssignment(typescript_1.factory.createIdentifier('rules'), typescript_1.factory.createObjectLiteralExpression([
                    typescript_1.factory.createPropertyAssignment('type', typescript_1.factory.createStringLiteral('Enum')),
                    typescript_1.factory.createPropertyAssignment('enums', typescript_1.factory.createArrayLiteralExpression(this.enum.map((x) => typescript_1.factory.createStringLiteral(x)), true)),
                ], true)));
            }
            if (properties.length) {
                args.push(typescript_1.factory.createObjectLiteralExpression(properties, true));
            }
            members.add('Typed');
            list.push(typescript_1.factory.createDecorator(typescript_1.factory.createCallExpression(typescript_1.factory.createIdentifier('Typed'), undefined, args)));
        }
        info.importSource.set('@geckoai/class-transformer', members);
        return list;
    }
    /**
     * 获取成员类型
     */
    getItemType() {
        if (this.items && this.items.type) {
            switch (this.items.type) {
                case 'boolean':
                    return typescript_1.SyntaxKind.BooleanKeyword;
                case 'string':
                    return typescript_1.SyntaxKind.StringKeyword;
                case 'number':
                    return typescript_1.SyntaxKind.NumberKeyword;
                case 'integer':
                    return typescript_1.SyntaxKind.NumberKeyword;
                case 'float':
                    return typescript_1.SyntaxKind.NumberKeyword;
                case 'double':
                    return typescript_1.SyntaxKind.NumberKeyword;
            }
        }
        if (this.schema && this.schema.type) {
            switch (this.schema.type) {
                case 'boolean':
                    return typescript_1.SyntaxKind.BooleanKeyword;
                case 'string':
                    return typescript_1.SyntaxKind.StringKeyword;
                case 'number':
                    return typescript_1.SyntaxKind.NumberKeyword;
                case 'integer':
                    return typescript_1.SyntaxKind.NumberKeyword;
                case 'float':
                    return typescript_1.SyntaxKind.NumberKeyword;
                case 'double':
                    return typescript_1.SyntaxKind.NumberKeyword;
            }
        }
        return typescript_1.SyntaxKind.AnyKeyword;
    }
    /**
     * 创建类型
     * @param name
     */
    createTypeNode(name) {
        switch (this.getType()) {
            case 'array':
                return typescript_1.factory.createArrayTypeNode(name
                    ? typescript_1.factory.createTypeReferenceNode(typescript_1.factory.createIdentifier(name), undefined)
                    : typescript_1.factory.createKeywordTypeNode(this.getItemType()));
            case 'object':
                return name
                    ? typescript_1.factory.createTypeReferenceNode(typescript_1.factory.createIdentifier(name), undefined)
                    : typescript_1.factory.createKeywordTypeNode(typescript_1.SyntaxKind.AnyKeyword);
            case 'string':
                return typescript_1.factory.createKeywordTypeNode(typescript_1.SyntaxKind.StringKeyword);
            case 'boolean':
                return typescript_1.factory.createKeywordTypeNode(typescript_1.SyntaxKind.BooleanKeyword);
            case 'integer':
                return typescript_1.factory.createKeywordTypeNode(typescript_1.SyntaxKind.NumberKeyword);
            case 'float':
                return typescript_1.factory.createKeywordTypeNode(typescript_1.SyntaxKind.NumberKeyword);
            case 'double':
                return typescript_1.factory.createKeywordTypeNode(typescript_1.SyntaxKind.NumberKeyword);
            case 'number':
                return typescript_1.factory.createKeywordTypeNode(typescript_1.SyntaxKind.NumberKeyword);
            default:
                return typescript_1.factory.createKeywordTypeNode(typescript_1.SyntaxKind.AnyKeyword);
        }
    }
    /**
     * createQuestionOrExclamationToken
     */
    createQuestionOrExclamationToken() {
        if (!this.required) {
            return typescript_1.factory.createToken(typescript_1.SyntaxKind.QuestionToken);
        }
        return undefined;
    }
    /**
     * createDeclaration
     */
    createDeclaration(info) {
        return typescript_1.factory.createPropertyDeclaration(this.createDecorators(info), [typescript_1.factory.createModifier(typescript_1.SyntaxKind.PublicKeyword)], this.name, this.createQuestionOrExclamationToken(), this.createTypeNode(), undefined);
    }
}
__decorate([
    (0, class_transformer_1.Typed)(),
    __metadata("design:type", String)
], OpenApiPathMethodParameter.prototype, "name", void 0);
__decorate([
    (0, class_transformer_1.Typed)(String),
    __metadata("design:type", String)
], OpenApiPathMethodParameter.prototype, "in", void 0);
__decorate([
    (0, class_transformer_1.Typed)(),
    __metadata("design:type", String)
], OpenApiPathMethodParameter.prototype, "description", void 0);
__decorate([
    (0, class_transformer_1.Typed)(),
    __metadata("design:type", Boolean)
], OpenApiPathMethodParameter.prototype, "required", void 0);
__decorate([
    (0, class_transformer_1.Typed)(),
    __metadata("design:type", String)
], OpenApiPathMethodParameter.prototype, "type", void 0);
__decorate([
    (0, class_transformer_1.Typed)(),
    __metadata("design:type", String)
], OpenApiPathMethodParameter.prototype, "style", void 0);
__decorate([
    (0, class_transformer_1.Typed)(),
    __metadata("design:type", String)
], OpenApiPathMethodParameter.prototype, "format", void 0);
__decorate([
    (0, class_transformer_1.TypedArray)(String),
    __metadata("design:type", Array)
], OpenApiPathMethodParameter.prototype, "enum", void 0);
__decorate([
    (0, class_transformer_1.Typed)(open_api_items_1.OpenApiItems),
    __metadata("design:type", open_api_items_1.OpenApiItems)
], OpenApiPathMethodParameter.prototype, "items", void 0);
__decorate([
    (0, class_transformer_1.Typed)(open_api_items_1.OpenApiItems),
    __metadata("design:type", open_api_items_1.OpenApiItems)
], OpenApiPathMethodParameter.prototype, "schema", void 0);
exports.OpenApiPathMethodParameter = OpenApiPathMethodParameter;
