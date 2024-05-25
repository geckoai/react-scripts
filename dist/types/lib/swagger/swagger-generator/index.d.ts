import { SwaggerGeneratorDto } from '../swagger-generator-dto';
import { SwaggerGeneratorVo } from '../swagger-generator-vo';
/**
 * 输出信息
 */
export declare class SwaggerGenerator {
    /**
     * 生成文件存储的目录
     */
    dest: string;
    /**
     * dtos
     */
    dtos: SwaggerGeneratorDto[];
    /**
     * vos
     */
    vos: SwaggerGeneratorVo[];
}
