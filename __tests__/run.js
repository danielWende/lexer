const { Parser } = require("../src/Parser");
const lexer = new Parser();
const Program = `"hello"`;
const ast = lexer.parse(Program);

console.log(JSON.stringify(ast, null, 2));
