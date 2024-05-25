import { OpenApiItems } from '../open-api-items';
import { Decorator, PropertyDeclaration, PunctuationToken, TypeNode } from 'typescript';
import { OpenApiPathMethodInfo } from '../open-api-path-method-info';
/**
 * OpenAPI info docs
 */
export declare class OpenApiPathMethodParameter {
    name: string;
    in: 'query' | 'header' | 'path' | 'body';
    description?: string;
    required: boolean;
    type?: string;
    style?: string;
    format?: string;
    enum?: string[];
    items?: OpenApiItems;
    schema?: OpenApiItems;
    /**
     * 检测是否包含类型
     */
    hasType(): boolean;
    /**
     * 获取类型
     */
    getType(): string | undefined;
    /**
     * docrators
     */
    createDecorators(info: OpenApiPathMethodInfo): Decorator[];
    /**
     * 获取成员类型
     */
    getItemType(): number;
    /**
     * 创建类型
     * @param name
     */
    createTypeNode(name?: string): TypeNode;
    /**
     * createQuestionOrExclamationToken
     */
    createQuestionOrExclamationToken(): PunctuationToken<any> | undefined;
    /**
     * createDeclaration
     */
    createDeclaration(info: OpenApiPathMethodInfo): PropertyDeclaration;
}
