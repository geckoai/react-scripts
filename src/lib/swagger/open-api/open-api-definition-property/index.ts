import { Typed, TypedArray } from '@geckoai/class-transformer';
import { OpenApiItems } from '../open-api-items';
import {
  Decorator,
  Expression,
  factory,
  ObjectLiteralElementLike,
  PropertyDeclaration,
  SyntaxKind,
  TypeNode,
} from 'typescript';
import { OpenApiDefinition } from '../open-api-definition';
import { SwaggerGenerator } from '../../swagger-generator';
import { Utils } from '../../utils';

/**
 * 输出信息
 */
export class OpenApiDefinitionProperty {
  @Typed()
  public type?:
    | 'object'
    | 'string'
    | 'array'
    | 'boolean'
    | 'integer'
    | 'float'
    | 'double'
    | 'number';

  @Typed()
  public description?: string;

  @TypedArray(String)
  public enum?: string[];

  @Typed(OpenApiItems)
  public items?: OpenApiItems;

  @Typed()
  public $ref?: string;

  /**
   * createDecorators
   * @param info
   * @param output
   */
  public createDecorators(
    info: OpenApiDefinition,
    output: SwaggerGenerator
  ): Decorator[] {
    const members = info.importSource.get('@geckoai/http') || new Set();
    const transformers =
      info.importSource.get('@geckoai/class-transformer') || new Set();
    members.add('ApiProperty');
    if (
      this.type !== 'object' ||
      Boolean(this.items && this.items.$ref) ||
      this.$ref
    ) {
      const list = [
        factory.createDecorator(
          factory.createCallExpression(
            factory.createIdentifier('ApiProperty'),
            undefined,
            [
              factory.createObjectLiteralExpression(
                [
                  factory.createPropertyAssignment(
                    'type',
                    factory.createStringLiteral(this.type || '')
                  ),
                  factory.createPropertyAssignment(
                    'description',
                    factory.createStringLiteral(this.description || '')
                  ),
                ],
                true
              ),
            ]
          )
        ),
      ];

      if (this.type) {
        if (this.type === 'array' && (this.$ref || this.items)) {
          transformers.add('TypedArray');
          let type = '';
          if (this.items) {
            type = this.items.type || '';
            if (this.items.$ref) {
              const splits = this.items.$ref.split('/');
              type = splits[splits.length - 1];
              if (type) {
                const find = output.vos.find((x) => x.target === type);
                if (find && find.name) {
                  type = find.name;
                  info.importSource.set(
                    `./${Utils.getName(find.name)}`,
                    new Set([find.name])
                  );
                }
              }
            }
          }

          const args: Expression[] = [];
          if (type === 'string') {
            args.push(factory.createIdentifier('String'));
          } else if (type === 'boolean') {
            args.push(factory.createIdentifier('Boolean'));
          } else if (/(integer|number|float|double)/.test(type)) {
            args.push(factory.createIdentifier('Number'));
          } else if (type) {
            args.push(factory.createIdentifier(type));
          }

          const properties: ObjectLiteralElementLike[] = [];
          if (this.enum) {
            properties.push(
              factory.createPropertyAssignment(
                factory.createIdentifier('elementRules'),
                factory.createObjectLiteralExpression(
                  [
                    factory.createPropertyAssignment(
                      'type',
                      factory.createStringLiteral('Enum')
                    ),
                    factory.createPropertyAssignment(
                      'enums',
                      factory.createArrayLiteralExpression(
                        this.enum.map((x) => factory.createStringLiteral(x)),
                        true
                      )
                    ),
                  ],
                  true
                )
              )
            );
          }
          if (properties.length) {
            args.push(factory.createObjectLiteralExpression(properties, true));
          }

          list.push(
            factory.createDecorator(
              factory.createCallExpression(
                factory.createIdentifier('TypedArray'),
                undefined,
                args
              )
            )
          );
        } else if (this.type) {
          transformers.add('Typed');
          const args: Expression[] = [];
          if (this.type === 'string') {
            args.push(factory.createIdentifier('String'));
          } else if (this.type === 'boolean') {
            args.push(factory.createIdentifier('Boolean'));
          } else if (/(integer|number|float|double)/.test(this.type)) {
            args.push(factory.createIdentifier('Number'));
          } else {
            args.push(factory.createIdentifier(this.type));
          }

          const properties: ObjectLiteralElementLike[] = [];
          if (this.enum) {
            properties.push(
              factory.createPropertyAssignment(
                factory.createIdentifier('rules'),
                factory.createObjectLiteralExpression(
                  [
                    factory.createPropertyAssignment(
                      'type',
                      factory.createStringLiteral('Enum')
                    ),
                    factory.createPropertyAssignment(
                      'enums',
                      factory.createArrayLiteralExpression(
                        this.enum.map((x) => factory.createStringLiteral(x)),
                        true
                      )
                    ),
                  ],
                  true
                )
              )
            );
          }
          if (properties.length) {
            args.push(factory.createObjectLiteralExpression(properties, true));
          }

          list.push(
            factory.createDecorator(
              factory.createCallExpression(
                factory.createIdentifier('Typed'),
                undefined,
                args
              )
            )
          );
        }
      }

      info.importSource.set('@geckoai/http', members);
      info.importSource.set('@geckoai/class-transformer', transformers);
      return list;
    }
    transformers.add('Typed');
    transformers.add('Any');
    return [
      factory.createDecorator(
        factory.createCallExpression(
          factory.createIdentifier('Typed'),
          undefined,
          [factory.createIdentifier('Any')]
        )
      ),
    ];
  }

  /**
   * 获取成员类型
   */
  public getItemType(): number {
    if (this.items && this.items.type) {
      switch (this.items.type) {
        case 'boolean':
          return SyntaxKind.BooleanKeyword;
        case 'string':
          return SyntaxKind.StringKeyword;
        case 'number':
          return SyntaxKind.NumberKeyword;
        case 'integer':
          return SyntaxKind.NumberKeyword;
        case 'float':
          return SyntaxKind.NumberKeyword;
        case 'double':
          return SyntaxKind.NumberKeyword;
      }
    }

    return SyntaxKind.AnyKeyword;
  }

  /**
   * 创建类型
   */
  public createTypeNode(output: SwaggerGenerator): TypeNode {
    let name = '';
    if (this.items) {
      if (this.items.$ref) {
        const splits = this.items.$ref.split('/');
        name = splits[splits.length - 1];
        if (name) {
          const find = output.vos.find((x) => x.target === name);
          if (find && find.name) {
            name = find.name;
          }
        }
      }
    }

    if (this.$ref) {
      const splits = this.$ref.split('/');
      name = splits[splits.length - 1];
      if (name) {
        const find = output.vos.find((x) => x.target === name);
        if (find && find.name) {
          name = find.name;
        }
      }
    }

    if (!name && this.type === 'object') {
      name = 'T';
    }

    switch (this.type) {
      case 'array':
        return factory.createArrayTypeNode(
          name
            ? factory.createTypeReferenceNode(
                factory.createIdentifier(name),
                undefined
              )
            : factory.createKeywordTypeNode(this.getItemType())
        );
      case 'object':
        return name
          ? factory.createTypeReferenceNode(
              factory.createIdentifier(name),
              undefined
            )
          : factory.createKeywordTypeNode(SyntaxKind.AnyKeyword);
      case 'string':
        return factory.createKeywordTypeNode(SyntaxKind.StringKeyword);
      case 'boolean':
        return factory.createKeywordTypeNode(SyntaxKind.BooleanKeyword);
      case 'integer':
        return factory.createKeywordTypeNode(SyntaxKind.NumberKeyword);
      case 'float':
        return factory.createKeywordTypeNode(SyntaxKind.NumberKeyword);
      case 'double':
        return factory.createKeywordTypeNode(SyntaxKind.NumberKeyword);
      case 'number':
        return factory.createKeywordTypeNode(SyntaxKind.NumberKeyword);
      default:
        return factory.createKeywordTypeNode(SyntaxKind.AnyKeyword);
    }
  }

  /**
   * createDeclaration
   * @param name
   * @param info
   * @param output
   */
  public createDeclaration(
    name: string,
    info: OpenApiDefinition,
    output: SwaggerGenerator
  ): PropertyDeclaration {
    return factory.createPropertyDeclaration(
      this.createDecorators(info, output),
      [factory.createModifier(SyntaxKind.PublicKeyword)],
      name,
      undefined,
      this.createTypeNode(output),
      undefined
    );
  }
}
