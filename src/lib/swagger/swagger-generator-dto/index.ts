import { Typed } from '@geckoai/class-transformer';

/**
 * @class SwaggerGeneratorDto
 */
export class SwaggerGeneratorDto {
  /**
   * 对应的path
   */
  @Typed()
  public path: string;

  /**
   * 对应的method
   */
  @Typed()
  public method: string;

  /**
   * 输出的名称
   */
  @Typed()
  public name: string;
}
