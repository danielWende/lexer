import { Rule } from "./Parser";

class Tokenizer {
  private _cursor: any;
  private _string: string;
  private _rules: any;
  constructor(rules: Rule[]) {
    this._string = "";
    this._cursor = 0;
    this._rules = rules; // Store the rules as a property of the Tokenizer instance.
  }

  init(string: string) {
    this._string = string;
    this._cursor = 0;
  }

  /**
   * whether we still have more tokens.
   * **/
  hasMoreTokens() {
    return this._cursor < this._string.length;
  }

  /*
   *Obtain the next token
   *
   */

  getNextToken() {
    if (!this.hasMoreTokens()) return null;

    const string = this._string.slice(this._cursor);

    // Check all rules in the order they appear in the rules array
    for (const rule of this._rules) {
      const regex = new RegExp(rule.pattern);
      const match = string.match(regex);

      if (match) {
        if (!rule.ignore) {
          this._cursor += match[0].length || 1;
          return {
            type: rule.type,
            value: match[0],
          };
        }
      }
    }

    // If no match is found, move cursor to the next character
    this._cursor++;
    return null;
  }
}
interface Token {
  type: string; // Type of the token (e.g., "NUMBER", "STRING", "IDENTIFIER")
  value: string; // The actual value of the token (e.g., the numeric value, string content, identifier name)
  // You can add more properties as needed, depending on your lexer's requirements
}

export { Tokenizer as default, Token };
