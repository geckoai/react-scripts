import { Typed, TypedArray } from '@geckoai/class-transformer';
import { OpenApiItems } from '../open-api-items';
import {
  Decorator,
  Expression,
  factory,
  ObjectLiteralElementLike,
  PropertyAssignment,
  PropertyDeclaration,
  PunctuationToken,
  SyntaxKind,
  TypeNode,
} from 'typescript';
import { OpenApiPathMethodInfo } from '../open-api-path-method-info';

/**
 * OpenAPI info docs
 */
export class OpenApiPathMethodParameter {
  @Typed()
  public name: string;

  @Typed(String)
  public in: 'query' | 'header' | 'path' | 'body';

  @Typed()
  public description?: string;

  @Typed()
  public required: boolean;

  @Typed()
  public type?: string;

  @Typed()
  public style?: string;

  @Typed()
  public format?: string;

  @TypedArray(String)
  public enum?: string[];

  @Typed(OpenApiItems)
  public items?: OpenApiItems;

  @Typed(OpenApiItems)
  public schema?: OpenApiItems;

  /**
   * 检测是否包含类型
   */
  public hasType(): boolean {
    return Boolean(this.type) || Boolean(this.items) || Boolean(this.schema);
  }

  /**
   * 获取类型
   */
  public getType(): string | undefined {
    if (this.type) {
      return this.type;
    }

    if (this.schema && this.schema.type) {
      return this.schema.type;
    }
  }

  /**
   * docrators
   */
  public createDecorators(info: OpenApiPathMethodInfo): Decorator[] {
    const assignmenets: PropertyAssignment[] = [];
    const members =
      info.importSource.get('@geckoai/class-transformer') || new Set();

    if (this.format) {
      assignmenets.push(
        factory.createPropertyAssignment(
          factory.createIdentifier('format'),
          factory.createStringLiteral(this.format)
        )
      );
    }

    const list: Decorator[] = [
      factory.createDecorator(
        factory.createCallExpression(
          factory.createIdentifier('ApiProperty'),
          undefined,
          [
            factory.createObjectLiteralExpression(
              [
                factory.createPropertyAssignment(
                  factory.createIdentifier('required'),
                  this.required ? factory.createTrue() : factory.createFalse()
                ),
                factory.createPropertyAssignment(
                  factory.createIdentifier('description'),
                  factory.createStringLiteral(this.description || '')
                ),
                factory.createPropertyAssignment(
                  factory.createIdentifier('in'),
                  factory.createStringLiteral(this.in)
                ),
                factory.createPropertyAssignment(
                  factory.createIdentifier('type'),
                  factory.createStringLiteral(this.getType() || '')
                ),
                ...assignmenets,
              ],
              true
            ),
          ]
        )
      ),
    ];

    if (this.type === 'array') {
      const args: Expression[] = [];
      let type = '';
      if (this.items && this.items.type) {
        type = this.items.type;
      }

      if (this.schema && this.schema.type) {
        type = this.schema.type;
      }
      if (type) {
        if (type === 'string') {
          args.push(factory.createIdentifier('String'));
        }
        if (type === 'boolean') {
          args.push(factory.createIdentifier('Boolean'));
        }
        if (/(integer|number|float|double)/.test(type)) {
          args.push(factory.createIdentifier('Number'));
        }
        const properties: ObjectLiteralElementLike[] = [];
        if (this.required) {
          properties.push(
            factory.createPropertyAssignment(
              factory.createIdentifier('required'),
              factory.createTrue()
            )
          );
        }
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
        members.add('TypedArray');
        list.push(
          factory.createDecorator(
            factory.createCallExpression(
              factory.createIdentifier('TypedArray'),
              undefined,
              args
            )
          )
        );
      }
    } else {
      const args: Expression[] = [];
      if (this.type) {
        if (this.type === 'string') {
          args.push(factory.createIdentifier('String'));
        }
        if (this.type === 'boolean') {
          args.push(factory.createIdentifier('Boolean'));
        }
        if (/(integer|number|float|double)/.test(this.type)) {
          args.push(factory.createIdentifier('Number'));
        }
      }
      const properties: ObjectLiteralElementLike[] = [];
      if (this.required) {
        properties.push(
          factory.createPropertyAssignment(
            factory.createIdentifier('required'),
            factory.createTrue()
          )
        );
      }
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
      members.add('Typed');
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
    info.importSource.set('@geckoai/class-transformer', members);
    return list;
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

    if (this.schema && this.schema.type) {
      switch (this.schema.type) {
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
   * @param name
   */
  public createTypeNode(name?: string): TypeNode {
    switch (this.getType()) {
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
   * createQuestionOrExclamationToken
   */
  public createQuestionOrExclamationToken(): PunctuationToken<any> | undefined {
    if (!this.required) {
      return factory.createToken(SyntaxKind.QuestionToken);
    }
    return undefined;
  }

  /**
   * createDeclaration
   */
  public createDeclaration(info: OpenApiPathMethodInfo): PropertyDeclaration {
    return factory.createPropertyDeclaration(
      this.createDecorators(info),
      [factory.createModifier(SyntaxKind.PublicKeyword)],
      this.name,
      this.createQuestionOrExclamationToken(),
      this.createTypeNode(),
      undefined
    );
  }
}
