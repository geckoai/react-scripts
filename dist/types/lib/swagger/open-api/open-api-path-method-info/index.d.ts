import { OpenApiPathMethodParameter } from '../open-api-path-method-parameter';
import { Decorator, ImportDeclaration, Modifier, PropertyDeclaration } from 'typescript';
import { SwaggerGenerator } from '../../swagger-generator';
/**
 * OpenAPI info docs
 */
export declare class OpenApiPathMethodInfo {
    /**
     * createModifiers
     */
    static createModifiers(): Modifier[];
    summary: string;
    description?: string;
    operationId: string;
    parameters: OpenApiPathMethodParameter[];
    /**
     * createDecorators
     * @param url
     * @param method
     */
    createDecorators(url: string, method: string): Decorator[];
    importSource: Map<string, Set<string>>;
    /**
     * 初始化
     */
    init(): void;
    /**
     * createImportDeclarations
     */
    createImportDeclarations(): ImportDeclaration[];
    /**
     * getMembers
     */
    getMembers(): PropertyDeclaration[];
    /**
     * 创建文件
     * @param url
     * @param method
     * @param name
     * @param dest
     * @param output
     */
    createFile(url: string, method: string, name: string, dest: string, output: SwaggerGenerator): Promise<void>;
}
