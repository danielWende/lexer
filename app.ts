import Parser from "./Parser";

interface Rule {
  pattern: RegExp;
  type: string;
  ignore?: boolean;
}
const rules: Rule[] = [
  { pattern: /\s+/, type: "WHITESPACE", ignore: true },
  { pattern: /\/\*[\s\S]*?\*\//, type: "COMMENT" },
  { pattern: /\/\/.*/, type: "COMMENT" },
  { pattern: /'[^']*'/, type: "STRING" },
  { pattern: /"[^"]*"/, type: "STRING" },
  { pattern: /[+\-*/%]/, type: "OPERATOR" },
  { pattern: /\d+\.\d+/, type: "FLOAT" },
  { pattern: /\d+/, type: "NUMBER" },
  { pattern: /;/, type: "SEMICOLON" },
  { pattern: /\(/, type: "LEFT_PAREN" },
  { pattern: /\)/, type: "RIGHT_PAREN" },
  { pattern: /\[/, type: "LEFT_BRACKET" },
  { pattern: /]/, type: "RIGHT_BRACKET" },
  { pattern: /{/, type: "LEFT_BRACE" },
  { pattern: /}/, type: "RIGHT_BRACE" },
  { pattern: /if/i, type: "IF" },
  { pattern: /else/i, type: "ELSE" },
  { pattern: /while/i, type: "WHILE" },
  { pattern: /function/i, type: "FUNCTION" },
  { pattern: /const/i, type: "CONST" },
  { pattern: /let/i, type: "LET" },
  { pattern: /true|false/i, type: "BOOLEAN" },
  { pattern: /null/i, type: "NULL" },
  { pattern: /[a-zA-Z_]\w*/, type: "IDENTIFIER" },
  { pattern: /&|\||\^|~|<</, type: "BITWISE_OPERATOR" },
  { pattern: /\?/, type: "TERNARY_CONDITIONAL" },
  { pattern: /===/, type: "STRICT_EQUAL" },
  { pattern: /==/, type: "EQUAL" },
  { pattern: /=/, type: "ASSIGNMENT" },
];
const parser = new Parser(rules);

const program = `const x = 10;`;

const ast = parser.parse(program);
console.log(JSON.stringify(ast, null, 2));
