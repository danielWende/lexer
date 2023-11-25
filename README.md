# Lexer App

This is a lexer application built using JavaScript. It is designed to analyze and tokenize input text based on a specified set of rules or patterns. The lexer breaks down the input text into smaller units called tokens, which can then be further processed or analyzed.

## Getting Started

To use the lexer app, follow these steps:

1. Clone the repository or download the source code.
2. Open the project folder in your preferred code editor.

## Usage

To tokenize a piece of text using the lexer app, you need to define the rules or patterns that the lexer will use to identify tokens. These rules are typically defined using regular expressions or other matching mechanisms.

Here's an example of how to use the lexer app:

```javascript
// Import the lexer module
import { Lexer } from ".src/Parser";

// Define the rules for tokenizing
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
  { pattern: /==|!=|<|<=|>|>=/, type: "COMPARISON_OPERATOR" },
  { pattern: /&&|\|\|/, type: "LOGICAL_OPERATOR" },
  { pattern: /if/, type: "IF" },
  { pattern: /else/, type: "ELSE" },
  { pattern: /while/, type: "WHILE" },
  { pattern: /function/, type: "FUNCTION" },
  { pattern: /\/\/.*/, type: "COMMENT" },
  { pattern: /\/\*[\s\S]*?\*\//, type: "COMMENT" },
  { pattern: /\s+/, type: "WHITESPACE", ignore: true },
];

// Create a new lexer instance
const lexer = new Lexer(rules);

// Tokenize input text
const tokens = lexer.tokenize("x = 10 + 5;");
// Tokenize a math expression
const expression = "sin(PI/2) + pow(2, 3);";
const tokens = lexer.tokenize(expression);

// Print the tokens
tokens.forEach((token) => console.log(token));
```

In this example, we define several rules for tokenizing, such as identifying numbers, identifiers, operators, assignments, and semicolons. We create a new lexer instance with these rules and then use it to tokenize the input text `'x = 10 + 5;'`. Finally, we print out the resulting tokens.

## Customization

You can customize the lexer app according to your specific requirements. Here are some possible customizations:

- Modify or extend the set of tokenization rules to support additional patterns or token types.
- Implement additional processing or analysis steps after tokenization.
- Integrate the lexer into a larger application or framework.

Feel free to explore the code and make changes as needed to suit your particular use case.

## License

Feel free to use and modify it according to your needs.
