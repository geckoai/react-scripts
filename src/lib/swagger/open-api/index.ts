import { Typed, TypedMap } from '@geckoai/class-transformer';
import { OpenApiInfo } from './open-api-info';
import { OpenApiPathMethod } from './open-api-path-method';
import { OpenApiDefinition } from './open-api-definition';

/**
 * OpenAPI Docs
 */
export class OpenApi {
  @Typed(String)
  public swagger?: string;

  @Typed(String)
  public openapi?: string;

  @Typed(OpenApiInfo)
  public info: OpenApiInfo;

  @Typed()
  public basePath?: string;

  @TypedMap(OpenApiPathMethod, {
    transform: (values) => {
      const map = new Map();
      if (values !== null && typeof values === 'object') {
        Object.keys(values as object).forEach((key) => {
          map.set(key, values[key]);
        });
      }
      return map;
    },
  })
  public paths: Map<string, OpenApiPathMethod>;

  @TypedMap(OpenApiDefinition, {
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
  })
  public definitions: Map<string, OpenApiDefinition>;

  @TypedMap(OpenApiDefinition, {
    transform: (components) => {
      if (components && components.schemas) {
        const values = components.schemas;
        if (values !== null && typeof values === 'object') {
          const map = new Map();
          Object.keys(values).forEach((key) => {
            map.set(key, values[key]);
          });

          return map;
        }
      }
      return undefined;
    },
  })
  public components: Map<string, OpenApiDefinition>;
}
