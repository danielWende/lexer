import Tokenizer, { Token } from "./Tokenizer";

export interface Rule {
  pattern: RegExp;
  type: string;
  ignore?: boolean;
}

interface ASTNode {
  type: string;
  value?: string | number | ASTNode;
  identifier?: string;
  expression?: ASTNode;
  condition?: ASTNode;
  ifBlock?: ASTNode;
  left?: ASTNode;
  right?: ASTNode;
  elseBlock?: ASTNode | null;
  body?: ASTNode[];
  name?: string;
  operator?: string;
  parameters?: string[];
}

class Parser {
  private _string: string = "";
  private _tokenizer: Tokenizer;
  private _lookahead: Token | null = null;

  constructor(rules: Rule[]) {
    this._tokenizer = new Tokenizer(rules);
  }

  public parse(input: string): ASTNode {
    this._string = input.trim();
    this._tokenizer.init(input.trim());
    this._lookahead = this._tokenizer.getNextToken();

    return this.Program();
  }

  private Program(): ASTNode {
    const body: ASTNode[] = [];

    while (this._lookahead !== null) {
      const statement = this.Statement();
      body.push(statement);
    }

    return {
      type: "Program",
      body,
    };
  }

  private Statement(): ASTNode {
    if (!this._lookahead) return this.WhileStatement();

    switch (this._lookahead.type) {
      case "NUMBER":
        return this.NumericLiteral();
      case "STRING":
        return this.StringLiteral();
      case "IDENTIFIER":
        if (this._lookahead.value === "if") {
          return this.IfStatement();
        } else if (this._lookahead.value === "else") {
          return this.ElseStatement();
        } else if (this._lookahead.value === "while") {
          return this.WhileStatement();
        } else if (this._lookahead.value === "function") {
          return this.FunctionDeclaration();
        } else if (this._lookahead.value === "const") {
          return this.ConstDeclaration();
        } else if (this._lookahead.value === "let") {
          return this.LetDeclaration();
        } else {
          return this.SemicolonLiteral();
        }
      case "OPERATOR":
        if (["+", "-", "*", "/", "%"].includes(this._lookahead.value)) {
          return this.BinaryExpression();
        }
      case "SEMICOLON":
        return this.SemicolonLiteral();
      case "ASSIGNMENT":
        return this.AssignmentExpression();
      case "EQUAL":
        return this.EqualExpression();
      case "STRICT_EQUAL":
        return this.StrictEqualExpression();
      case "COMPARISON_OPERATOR":
        return this.ComparisonExpression();
      case "PUNCTUATION":
        this._eat("PUNCTUATION");
        return {
          type: "Punctuation",
        };
      case "IF":
        return this.IfStatement();
      case "ELSE":
        return this.ElseStatement();
      case "WHILE":
        return this.WhileStatement();
      case "FUNCTION":
        return this.FunctionDeclaration();
      case "CONST":
        return this.ConstDeclaration();
      case "LET":
        return this.LetDeclaration();
      default:
        throw new SyntaxError(`Unexpected token: "${this._lookahead.value}"`);
    }
  }

  private NumericLiteral(): ASTNode {
    const token = this._eat("NUMBER");
    return {
      type: "NumericLiteral",
      value: Number(token.value),
    };
  }

  private StringLiteral(): ASTNode {
    const token = this._eat("STRING");
    return {
      type: "StringLiteral",
      value: token.value,
    };
  }

  private SemicolonLiteral(): ASTNode {
    // Check if the current token is a SEMICOLON
    if (this._lookahead && this._lookahead.type === "SEMICOLON") {
      const token = this._eat("SEMICOLON");
      return {
        type: "SEMICOLON",
        value: token.value,
      };
    } else {
      // If there's no SEMICOLON, handle it accordingly
      return {
        type: "SEMICOLON",
      };
    }
  }

  private ComparisonExpression(): ASTNode {
    let left = this.AdditiveExpression();

    while (this._lookahead && this._lookahead.type === "COMPARISON_OPERATOR") {
      const operator = this._lookahead.value;
      this._eat("COMPARISON_OPERATOR");
      const right = this.AdditiveExpression();
      left = {
        type: "ComparisonExpression",
        operator,
        left,
        right,
      };
    }

    return left;
  }

  private AdditiveExpression(): ASTNode {
    let left = this.MultiplicativeExpression();

    while (
      this._lookahead &&
      this._lookahead.type === "OPERATOR" &&
      ["+", "-"].includes(this._lookahead.value)
    ) {
      const operator = this._lookahead.value;
      this._eat("OPERATOR");
      const right = this.MultiplicativeExpression();
      left = {
        type: "BinaryExpression",
        operator,
        left,
        right,
      };
    }

    return left;
  }

  private MultiplicativeExpression(): ASTNode {
    let left = this.PrimaryExpression();

    while (
      this._lookahead &&
      this._lookahead.type === "OPERATOR" &&
      ["*", "/", "%"].includes(this._lookahead.value)
    ) {
      const operator = this._lookahead.value;
      this._eat("OPERATOR");
      const right = this.PrimaryExpression();
      left = {
        type: "BinaryExpression",
        operator,
        left,
        right,
      };
    }

    return left;
  }

  private IfStatement(): ASTNode {
    this._eat("IF");
    this._eat("LEFT_PAREN");
    const condition = this.Expression();
    this._eat("RIGHT_PAREN");
    const ifBlock = this.Block();

    let elseBlock: ASTNode | null = null;
    if (this._lookahead && this._lookahead.type === "ELSE") {
      this._eat("ELSE");
      elseBlock = this.Block();
    }

    return {
      type: "IfStatement",
      condition,
      ifBlock,
      elseBlock,
    };
  }

  private ElseStatement(): ASTNode {
    this._eat("ELSE");
    return this.Block();
  }

  private WhileStatement(): ASTNode {
    this._eat("WHILE");
    this._eat("LEFT_PAREN");
    const condition = this.Expression();
    this._eat("RIGHT_PAREN");
    return {
      type: "WhileStatement",
      condition,
      body: [this.Block()],
    };
  }

  private PrimaryExpression(): ASTNode {
    if (!this._lookahead)
      throw {
        type: "Error",
        message: "Unexpected end of input",
      };
    switch (this._lookahead.type) {
      case "NUMBER":
        return this.NumericLiteral();
      case "STRING":
        return this.StringLiteral();
      case "IDENTIFIER":
        const identifier = this._eat("IDENTIFIER");
        return {
          type: "Identifier",
          name: identifier.value,
        };
      case "LEFT_PAREN":
        this._eat("LEFT_PAREN");
        const expression = this.Expression();
        this._eat("RIGHT_PAREN");
        return expression;
      case "COMPARISON_OPERATOR":
        return this.ComparisonExpression();
      case "SEMICOLON":
        return this.SemicolonLiteral();
      default:
        throw new SyntaxError(`Unexpected token: "${this._lookahead.value}"`);
    }
  }

  private FunctionDeclaration(): ASTNode {
    this._eat("FUNCTION");
    const functionName = this._eat("IDENTIFIER");
    this._eat("LEFT_PAREN");
    const params: string[] = [];
    while (this._lookahead && this._lookahead.type === "IDENTIFIER") {
      params.push(this._eat("IDENTIFIER").value);
      if (this._lookahead.value === ",") {
        this._eat("PUNCTUATION");
      }
    }
    this._eat("RIGHT_PAREN");
    return {
      type: "FunctionDeclaration",
      name: functionName.value,
      parameters: params,
      body: [this.Block()],
    };
  }

  private ConstDeclaration(): ASTNode {
    this._eat("CONST");
    const identifier = this._eat("IDENTIFIER");

    // Check if there's an assignment
    if (this._lookahead && this._lookahead.type === "ASSIGNMENT") {
      this._eat("ASSIGNMENT");
      const value = this.AssignmentExpression();
      return {
        type: "ConstDeclaration",
        identifier: identifier.value,
        value,
      };
    } else {
      // No assignment, just the const declaration
      return {
        type: "ConstDeclaration",
        identifier: identifier.value,
      };
    }
  }

  private LetDeclaration(): ASTNode {
    this._eat("LET");
    const identifier = this._eat("IDENTIFIER");
    this._eat("ASSIGNMENT");
    const value = this.AssignmentExpression();
    return {
      type: "LetDeclaration",
      identifier: identifier.value,
      value,
    };
  }
  private Expression(): ASTNode {
    return this.AssignmentExpression();
  }

  // private AssignmentExpression(): ASTNode {
  //   const left = this.PrimaryExpression();

  //   if (this._lookahead && this._lookahead.type === "ASSIGNMENT") {
  //     this._eat("ASSIGNMENT");
  //     const right = this.AssignmentExpression();
  //     return {
  //       type: "AssignmentExpression",
  //       left,
  //       right,
  //     };
  //   }

  //   return left;
  // }
  private StrictEqualExpression(): ASTNode {
    const left = this.EqualExpression();
    if (this._lookahead && this._lookahead.type === "STRICT_EQUAL") {
      this._eat("STRICT_EQUAL");
      const right = this.EqualExpression();
      return {
        type: "BinaryExpression",
        operator: "===",
        left,
        right,
      };
    }
    return left;
  }

  private EqualExpression(): ASTNode {
    const left = this.AssignmentExpression();
    if (this._lookahead && this._lookahead.type === "EQUAL") {
      this._eat("EQUAL");
      const right = this.AssignmentExpression();
      return {
        type: "BinaryExpression",
        operator: "==",
        left,
        right,
      };
    }
    return left;
  }

  private AssignmentExpression(): ASTNode {
    // Implement your logic for assignment expressions
    // This is just a placeholder, replace it with your actual implementation
    return {
      type: "AssignmentExpression",
      operator: "=",
    };
  }

  private BinaryExpression(): ASTNode {
    let left = this.PrimaryExpression();

    while (
      this._lookahead &&
      this._lookahead.type === "OPERATOR" &&
      ["+", "-", "*", "/", "%"].includes(this._lookahead.value)
    ) {
      const operator = this._eat("OPERATOR");
      const right = this.PrimaryExpression();
      left = {
        type: "BinaryExpression",
        operator: operator.value,
        left,
        right,
      };
    }

    return left;
  }

  private Block(): ASTNode {
    this._eat("LEFT_BRACE");

    const body: ASTNode[] = [];
    while (this._lookahead && this._lookahead.type !== "RIGHT_BRACE") {
      const statement = this.Statement();
      body.push(statement);
    }

    this._eat("RIGHT_BRACE");

    return {
      type: "Block",
      body,
    };
  }

  private _eat(tokenType: string): Token {
    const token = this._lookahead;

    if (token == null) {
      throw new SyntaxError(
        `Unexpected end of input, expected: "${tokenType}"`
      );
    }

    if (token.type !== tokenType) {
      throw new SyntaxError(
        `Unexpected token: "${token.value}", expected: "${tokenType}"`
      );
    }
    // console.log(`Eating token: ${tokenType}, Value: ${token.value}`);

    this._lookahead = this._tokenizer.getNextToken();

    console.log("🚀 ~ file: Parser.ts:447 ~ Parser ~ _eat ~ token:", token);
    return token;
  }
}

export default Parser;
