const Parser = require("../src/parser.js");

const rules = [
  { pattern: /\d+/, type: "NUMBER" },
  { pattern: /[a-zA-Z_]\w*/, type: "IDENTIFIER" },
  { pattern: /\+|-|\*|\/|%/, type: "OPERATOR" },
  { pattern: /=/, type: "ASSIGNMENT" },
  { pattern: /;/, type: "SEMICOLON" },
  { pattern: /'[^']*'/, type: "STRING" },
  { pattern: /"[^"]*"/, type: "STRING" },
  { pattern: /\(/, type: "LEFT_PAREN" },
  { pattern: /\)/, type: "RIGHT_PAREN" },
  { pattern: /\[/, type: "LEFT_BRACKET" },
  { pattern: /]/, type: "RIGHT_BRACKET" },
  { pattern: /\{/, type: "LEFT_BRACE" },
  { pattern: /}/, type: "RIGHT_BRACE" },
  { pattern: /==|!=|<|<=|>|>=/, type: "COMPARISON_OPERATOR" }, // Include comparison operators
  { pattern: /&&|\|\|/, type: "LOGICAL_OPERATOR" },
  { pattern: /if/, type: "IF" },
  { pattern: /else/, type: "ELSE" },
  { pattern: /while/, type: "WHILE" },
  { pattern: /function/, type: "FUNCTION" },
  { pattern: /\/\/.*/, type: "COMMENT" },
  { pattern: /\/\*[\s\S]*?\*\//, type: "COMMENT" },
  { pattern: /\s+/, type: "WHITESPACE", ignore: true },
];

const parser = new Parser(rules);

const program = `
  let x = 10;
  let y = 20;
  if (x > y) {
    result = "x is greater than y";
  } else {
    result = "x is less than or equal to y";
  }
  result;
`;

const ast = parser.parse(program);
console.log(JSON.stringify(ast, null, 2));
