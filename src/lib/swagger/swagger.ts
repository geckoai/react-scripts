import { SwaggerGenerator } from './swagger-generator';
import axios from 'axios';
import { transformer } from '../../utils';
import { OpenApi } from './open-api';
import { Typed, TypedArray } from '@geckoai/class-transformer';

/**
 * Swagger
 */
export class Swagger {
  @Typed()
  public url: string;

  @TypedArray(SwaggerGenerator)
  public outputs: SwaggerGenerator[] = [];

  /**
   * 加载配置文件
   */
  public async loadFile(): Promise<OpenApi> {
    try {
      const res = await axios.get(this.url);
      return transformer.transform(OpenApi, res.data as {});
    } catch (e) {
      throw new Error(`The file url: ${this.url} load final.`);
    }
  }
}
