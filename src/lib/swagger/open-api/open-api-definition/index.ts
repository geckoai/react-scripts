import { Typed, TypedMap } from '@geckoai/class-transformer';
import { OpenApiDefinitionProperty } from '../open-api-definition-property';
import path from 'path';
import { Utils } from '../../utils';
import {
  createSourceFile,
  EmitHint,
  factory,
  ImportDeclaration,
  Modifier,
  NodeFlags,
  PropertyDeclaration,
  ScriptTarget,
  SyntaxKind,
} from 'typescript';
import { SwaggerGenerator } from '../../swagger-generator';

/**
 * 输出信息
 */
export class OpenApiDefinition {
  /**
   * createModifiers
   */
  public static createModifiers(): Modifier[] {
    return [factory.createModifier(SyntaxKind.ExportKeyword)];
  }

  @Typed()
  public type: string;

  @Typed()
  public title: string;

  @TypedMap(OpenApiDefinitionProperty, {
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
  public properties: Map<string, OpenApiDefinitionProperty> = new Map();

  public importSource: Map<string, Set<string>> = new Map();

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
  public getMembers(output: SwaggerGenerator): PropertyDeclaration[] {
    const list: PropertyDeclaration[] = [];
    this.properties.forEach((x, name) => {
      if (list.length !== 0) {
        list.push(Utils.createNewLine());
      }
      list.push(x.createDeclaration(name, this, output));
    });
    return list;
  }

  /**
   * 创建文件
   * @param name
   * @param dest
   * @param output
   */
  public async createFile(
    name: string,
    dest: string,
    output: SwaggerGenerator
  ): Promise<void> {
    const fileName = path.join(dest, Utils.getName(name) + '.ts');
    const tsSourceFile = createSourceFile(fileName, '', ScriptTarget.Latest);
    const members = this.getMembers(output);
    const sourceFile = factory.createSourceFile(
      [
        ...this.createImportDeclarations(),
        Utils.createNewLine(),
        factory.createClassDeclaration(
          [],
          OpenApiDefinition.createModifiers(),
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
  }
}
