import { Typed, TypedArray } from '@geckoai/class-transformer';
import { OpenApiPathMethodParameter } from '../open-api-path-method-parameter';
import {
  Decorator,
  EmitHint,
  factory,
  createSourceFile,
  ImportDeclaration,
  Modifier,
  NodeFlags,
  ScriptTarget,
  SyntaxKind,
  PropertyDeclaration,
} from 'typescript';
import path from 'path';
import { Utils } from '../../utils';
import { SwaggerGenerator } from '../../swagger-generator';

/**
 * OpenAPI info docs
 */
export class OpenApiPathMethodInfo {
  /**
   * createModifiers
   */
  public static createModifiers(): Modifier[] {
    return [factory.createModifier(SyntaxKind.ExportKeyword)];
  }

  @Typed()
  public summary: string;

  @Typed()
  public description?: string;

  @Typed()
  public operationId: string;

  @TypedArray(OpenApiPathMethodParameter)
  public parameters: OpenApiPathMethodParameter[] = [];

  /**
   * createDecorators
   * @param url
   * @param method
   */
  public createDecorators(url: string, method: string): Decorator[] {
    return [
      factory.createDecorator(
        factory.createCallExpression(
          factory.createIdentifier('ApiRequest'),
          undefined,
          [
            factory.createObjectLiteralExpression(
              [
                factory.createPropertyAssignment(
                  factory.createIdentifier('url'),
                  factory.createStringLiteral(url)
                ),
                factory.createPropertyAssignment(
                  factory.createIdentifier('method'),
                  factory.createStringLiteral(method)
                ),
                factory.createPropertyAssignment(
                  factory.createIdentifier('description'),
                  factory.createStringLiteral(this.description || this.summary)
                ),
              ],
              true
            ),
          ]
        )
      ),
    ];
  }

  public importSource: Map<string, Set<string>> = new Map();

  /**
   * 初始化
   */
  public init(): void {
    const members = this.importSource.get('@geckoai/http') || new Set();
    members.add('ApiRequest');
    this.importSource.set('@geckoai/http', members);
  }

  /**
   * createImportDeclarations
   */
  public createImportDeclarations(): ImportDeclaration[] {
    const list: ImportDeclaration[] = [];
    this.importSource.forEach((members, source) => {
      list.push(
        factory.createImportDeclaration(
          undefined,
          undefined,
          factory.createImportClause(
            false,
            undefined,
            factory.createNamedImports(
              Array.from(members).map((member) =>
                factory.createImportSpecifier(
                  false,
                  undefined,
                  factory.createIdentifier(member)
                )
              )
            )
          ),
          factory.createStringLiteral(source)
        )
      );
    });
    return list;
  }

  /**
   * getMembers
   */
  public getMembers(): PropertyDeclaration[] {
    const list: PropertyDeclaration[] = [];
    this.parameters.forEach((x) => {
      if (x.hasType() && !/\./.test(x.name)) {
        if (list.length !== 0) {
          list.push(Utils.createNewLine());
        }
        list.push(x.createDeclaration(this));
      }
    });
    if (list.length) {
      if (this.parameters.length) {
        const members =
          this.importSource.get('@geckoai/http') || new Set();
        members.add('ApiProperty');
        this.importSource.set('@geckoai/http', members);
      }
    }
    return list;
  }

  /**
   * 创建文件
   * @param url
   * @param method
   * @param name
   * @param dest
   * @param output
   */
  public async createFile(
    url: string,
    method: string,
    name: string,
    dest: string,
    output: SwaggerGenerator
  ): Promise<void> {
    const fileName = path.join(dest, Utils.getName(name) + '.ts');
    try {
      this.init();
      const tsSourceFile = createSourceFile(fileName, '', ScriptTarget.Latest);
      const members = this.getMembers();
      const sourceFile = factory.createSourceFile(
        [
          ...this.createImportDeclarations(),
          Utils.createNewLine(),
          factory.createClassDeclaration(
            // [],
            this.createDecorators(url, method),
            OpenApiPathMethodInfo.createModifiers(),
            name,
            [],
            undefined,
            members
          ),
        ],
        factory.createToken(SyntaxKind.EndOfFileToken),
        NodeFlags.None
      );

      const file = Utils.printer.printNode(
        EmitHint.SourceFile,
        sourceFile,
        tsSourceFile
      );

      await Utils.write(fileName, Utils.unescape(file));
    } catch (e) {
      console.error(`CreateFileError: ${fileName}`);
    }
  }
}
