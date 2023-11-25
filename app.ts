import Parser from "./Parser";

interface Rule {
  pattern: RegExp;
  type: string;
  ignore?: boolean;
}
const rules: Rule[] = [
  { pattern: /\s+/, type: "WHITESPACE", ignore: true },
  { pattern: /if/i, type: "IF" },
  { pattern: /else/i, type: "ELSE" },
  { pattern: /while/i, type: "WHILE" },
  { pattern: /function/i, type: "FUNCTION" },
  { pattern: /let/i, type: "LET" },
  { pattern: /const/i, type: "CONST" },
  { pattern: /[a-zA-Z_]\w*/, type: "IDENTIFIER" },
  { pattern: /[+\-*/%]/, type: "OPERATOR" },
  { pattern: /=/, type: "ASSIGNMENT" },
  { pattern: /\d+/, type: "NUMBER" },
  { pattern: /;/, type: "SEMICOLON" },
  { pattern: /'[^']*'/, type: "STRING" },
  { pattern: /"[^"]*"/, type: "STRING" },
  { pattern: /\(/, type: "LEFT_PAREN" },
  { pattern: /\)/, type: "RIGHT_PAREN" },
  { pattern: /\[/, type: "LEFT_BRACKET" },
  { pattern: /]/, type: "RIGHT_BRACKET" },
  { pattern: /{/, type: "LEFT_BRACE" },
  { pattern: /}/, type: "RIGHT_BRACE" },
  { pattern: /==|!=|<|<=|>|>=/, type: "COMPARISON_OPERATOR" },
  { pattern: /&&|\|\|/, type: "LOGICAL_OPERATOR" },
  { pattern: /\/\/.*/, type: "COMMENT" },
  { pattern: /\/\*[\s\S]*?\*\//, type: "COMMENT" },
];

const parser = new Parser(rules);

const program = `const x = 10;`;

const ast = parser.parse(program);
console.log(JSON.stringify(ast, null, 2));
