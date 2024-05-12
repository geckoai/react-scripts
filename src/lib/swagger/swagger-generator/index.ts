import { Typed, TypedArray } from '@geckoai/class-transformer';
import { SwaggerGeneratorDto } from '../swagger-generator-dto';
import { SwaggerGeneratorVo } from '../swagger-generator-vo';

/**
 * 输出信息
 */
export class SwaggerGenerator {
  /**
   * 生成文件存储的目录
   */
  @Typed()
  public dest: string;

  /**
   * dtos
   */
  @TypedArray(SwaggerGeneratorDto)
  public dtos: SwaggerGeneratorDto[] = [];

  /**
   * vos
   */
  @TypedArray(SwaggerGeneratorVo)
  public vos: SwaggerGeneratorVo[] = [];
}
