import { SwaggerGenerator } from './swagger-generator';
import { OpenApi } from './open-api';
/**
 * Swagger
 */
export declare class Swagger {
    url: string;
    outputs: SwaggerGenerator[];
    /**
     * 加载配置文件
     */
    loadFile(): Promise<OpenApi>;
}
