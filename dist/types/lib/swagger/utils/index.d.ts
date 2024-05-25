import ts from 'typescript';
/**
 * 工具包
 */
export declare class Utils {
    /**
     * 创建一个空行
     */
    static createNewLine(): any;
    /**
     * unicode转汉字
     * @param input
     * @private
     */
    static unescape(input: string): string;
    /**
     * 创建文件夹
     * @param fileName
     * @private
     */
    private static createDir;
    /**
     * 获取文件名称
     * @param n
     */
    static getName(n: string): string;
    static overwrite: number;
    /**
     * typescript printer
     */
    static printer: ts.Printer;
    /**
     * 生成文件
     * @param fileName
     * @param file
     */
    static write(fileName: string, file: string): Promise<void>;
}
