import { OpenApiDefinitionProperty } from '../open-api-definition-property';
import { ImportDeclaration, Modifier, PropertyDeclaration } from 'typescript';
import { SwaggerGenerator } from '../../swagger-generator';
/**
 * 输出信息
 */
export declare class OpenApiDefinition {
    /**
     * createModifiers
     */
    static createModifiers(): Modifier[];
    type: string;
    title: string;
    properties: Map<string, OpenApiDefinitionProperty>;
    importSource: Map<string, Set<string>>;
    /**
     * createImportDeclarations
     */
    createImportDeclarations(): ImportDeclaration[];
    /**
     * getMembers
     */
    getMembers(output: SwaggerGenerator): PropertyDeclaration[];
    /**
     * 创建文件
     * @param name
     * @param dest
     * @param output
     */
    createFile(name: string, dest: string, output: SwaggerGenerator): Promise<void>;
}
