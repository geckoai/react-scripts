import { OpenApiInfo } from './open-api-info';
import { OpenApiPathMethod } from './open-api-path-method';
import { OpenApiDefinition } from './open-api-definition';
/**
 * OpenAPI Docs
 */
export declare class OpenApi {
    swagger?: string;
    openapi?: string;
    info: OpenApiInfo;
    basePath?: string;
    paths: Map<string, OpenApiPathMethod>;
    definitions: Map<string, OpenApiDefinition>;
    components: Map<string, OpenApiDefinition>;
}
