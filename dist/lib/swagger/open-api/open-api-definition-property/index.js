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
exports.OpenApiDefinitionProperty = void 0;
const class_transformer_1 = require("@geckoai/class-transformer");
const open_api_items_1 = require("../open-api-items");
const typescript_1 = require("typescript");
const utils_1 = require("../../utils");
/**
 * 输出信息
 */
class OpenApiDefinitionProperty {
    type;
    description;
    enum;
    items;
    $ref;
    /**
     * createDecorators
     * @param info
     * @param output
     */
    createDecorators(info, output) {
        const members = info.importSource.get('@geckoai/http') || new Set();
        const transformers = info.importSource.get('@geckoai/class-transformer') || new Set();
        members.add('ApiProperty');
        if (this.type !== 'object' ||
            Boolean(this.items && this.items.$ref) ||
            this.$ref) {
            const list = [
                typescript_1.factory.createDecorator(typescript_1.factory.createCallExpression(typescript_1.factory.createIdentifier('ApiProperty'), undefined, [
                    typescript_1.factory.createObjectLiteralExpression([
                        typescript_1.factory.createPropertyAssignment('type', typescript_1.factory.createStringLiteral(this.type || '')),
                        typescript_1.factory.createPropertyAssignment('description', typescript_1.factory.createStringLiteral(this.description || '')),
                    ], true),
                ])),
            ];
            if (this.type) {
                if (this.type === 'array' && (this.$ref || this.items)) {
                    transformers.add('TypedArray');
                    let type = '';
                    if (this.items) {
                        type = this.items.type || '';
                        if (this.items.$ref) {
                            const splits = this.items.$ref.split('/');
                            type = splits[splits.length - 1];
                            if (type) {
                                const find = output.vos.find((x) => x.target === type);
                                if (find && find.name) {
                                    type = find.name;
                                    info.importSource.set(`./${utils_1.Utils.getName(find.name)}`, new Set([find.name]));
                                }
                            }
                        }
                    }
                    const args = [];
                    if (type === 'string') {
                        args.push(typescript_1.factory.createIdentifier('String'));
                    }
                    else if (type === 'boolean') {
                        args.push(typescript_1.factory.createIdentifier('Boolean'));
                    }
                    else if (/(integer|number|float|double)/.test(type)) {
                        args.push(typescript_1.factory.createIdentifier('Number'));
                    }
                    else if (type) {
                        args.push(typescript_1.factory.createIdentifier(type));
                    }
                    const properties = [];
                    if (this.enum) {
                        properties.push(typescript_1.factory.createPropertyAssignment(typescript_1.factory.createIdentifier('elementRules'), typescript_1.factory.createObjectLiteralExpression([
                            typescript_1.factory.createPropertyAssignment('type', typescript_1.factory.createStringLiteral('Enum')),
                            typescript_1.factory.createPropertyAssignment('enums', typescript_1.factory.createArrayLiteralExpression(this.enum.map((x) => typescript_1.factory.createStringLiteral(x)), true)),
                        ], true)));
                    }
                    if (properties.length) {
                        args.push(typescript_1.factory.createObjectLiteralExpression(properties, true));
                    }
                    list.push(typescript_1.factory.createDecorator(typescript_1.factory.createCallExpression(typescript_1.factory.createIdentifier('TypedArray'), undefined, args)));
                }
                else if (this.type) {
                    transformers.add('Typed');
                    const args = [];
                    if (this.type === 'string') {
                        args.push(typescript_1.factory.createIdentifier('String'));
                    }
                    else if (this.type === 'boolean') {
                        args.push(typescript_1.factory.createIdentifier('Boolean'));
                    }
                    else if (/(integer|number|float|double)/.test(this.type)) {
                        args.push(typescript_1.factory.createIdentifier('Number'));
                    }
                    else {
                        args.push(typescript_1.factory.createIdentifier(this.type));
                    }
                    const properties = [];
                    if (this.enum) {
                        properties.push(typescript_1.factory.createPropertyAssignment(typescript_1.factory.createIdentifier('rules'), typescript_1.factory.createObjectLiteralExpression([
                            typescript_1.factory.createPropertyAssignment('type', typescript_1.factory.createStringLiteral('Enum')),
                            typescript_1.factory.createPropertyAssignment('enums', typescript_1.factory.createArrayLiteralExpression(this.enum.map((x) => typescript_1.factory.createStringLiteral(x)), true)),
                        ], true)));
                    }
                    if (properties.length) {
                        args.push(typescript_1.factory.createObjectLiteralExpression(properties, true));
                    }
                    list.push(typescript_1.factory.createDecorator(typescript_1.factory.createCallExpression(typescript_1.factory.createIdentifier('Typed'), undefined, args)));
                }
            }
            info.importSource.set('@geckoai/http', members);
            info.importSource.set('@geckoai/class-transformer', transformers);
            return list;
        }
        transformers.add('Typed');
        transformers.add('Any');
        return [
            typescript_1.factory.createDecorator(typescript_1.factory.createCallExpression(typescript_1.factory.createIdentifier('Typed'), undefined, [typescript_1.factory.createIdentifier('Any')])),
        ];
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
        return typescript_1.SyntaxKind.AnyKeyword;
    }
    /**
     * 创建类型
     */
    createTypeNode(output) {
        let name = '';
        if (this.items) {
            if (this.items.$ref) {
                const splits = this.items.$ref.split('/');
                name = splits[splits.length - 1];
                if (name) {
                    const find = output.vos.find((x) => x.target === name);
                    if (find && find.name) {
                        name = find.name;
                    }
                }
            }
        }
        if (this.$ref) {
            const splits = this.$ref.split('/');
            name = splits[splits.length - 1];
            if (name) {
                const find = output.vos.find((x) => x.target === name);
                if (find && find.name) {
                    name = find.name;
                }
            }
        }
        if (!name && this.type === 'object') {
            name = 'T';
        }
        switch (this.type) {
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
     * createDeclaration
     * @param name
     * @param info
     * @param output
     */
    createDeclaration(name, info, output) {
        return typescript_1.factory.createPropertyDeclaration(this.createDecorators(info, output), [typescript_1.factory.createModifier(typescript_1.SyntaxKind.PublicKeyword)], name, undefined, this.createTypeNode(output), undefined);
    }
}
__decorate([
    (0, class_transformer_1.Typed)(),
    __metadata("design:type", String)
], OpenApiDefinitionProperty.prototype, "type", void 0);
__decorate([
    (0, class_transformer_1.Typed)(),
    __metadata("design:type", String)
], OpenApiDefinitionProperty.prototype, "description", void 0);
__decorate([
    (0, class_transformer_1.TypedArray)(String),
    __metadata("design:type", Array)
], OpenApiDefinitionProperty.prototype, "enum", void 0);
__decorate([
    (0, class_transformer_1.Typed)(open_api_items_1.OpenApiItems),
    __metadata("design:type", open_api_items_1.OpenApiItems)
], OpenApiDefinitionProperty.prototype, "items", void 0);
__decorate([
    (0, class_transformer_1.Typed)(),
    __metadata("design:type", String)
], OpenApiDefinitionProperty.prototype, "$ref", void 0);
exports.OpenApiDefinitionProperty = OpenApiDefinitionProperty;
