import { Typed } from '@geckoai/class-transformer';
import { OpenApiPathMethodInfo } from '../open-api-path-method-info';
/**
 * OpenAPI info docs
 */
export class OpenApiPathMethod {
  @Typed(OpenApiPathMethodInfo)
  public get?: OpenApiPathMethodInfo;

  @Typed(OpenApiPathMethodInfo)
  public post?: OpenApiPathMethodInfo;

  @Typed(OpenApiPathMethodInfo)
  public put?: OpenApiPathMethodInfo;

  @Typed(OpenApiPathMethodInfo)
  public delete?: OpenApiPathMethodInfo;
}
