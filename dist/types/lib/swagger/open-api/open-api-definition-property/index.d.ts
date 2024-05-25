import { OpenApiItems } from '../open-api-items';
import { Decorator, PropertyDeclaration, TypeNode } from 'typescript';
import { OpenApiDefinition } from '../open-api-definition';
import { SwaggerGenerator } from '../../swagger-generator';
/**
 * 输出信息
 */
export declare class OpenApiDefinitionProperty {
    type?: 'object' | 'string' | 'array' | 'boolean' | 'integer' | 'float' | 'double' | 'number';
    description?: string;
    enum?: string[];
    items?: OpenApiItems;
    $ref?: string;
    /**
     * createDecorators
     * @param info
     * @param output
     */
    createDecorators(info: OpenApiDefinition, output: SwaggerGenerator): Decorator[];
    /**
     * 获取成员类型
     */
    getItemType(): number;
    /**
     * 创建类型
     */
    createTypeNode(output: SwaggerGenerator): TypeNode;
    /**
     * createDeclaration
     * @param name
     * @param info
     * @param output
     */
    createDeclaration(name: string, info: OpenApiDefinition, output: SwaggerGenerator): PropertyDeclaration;
}
