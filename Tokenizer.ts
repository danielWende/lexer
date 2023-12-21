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

  // getNextToken() {
  //   if (!this.hasMoreTokens()) return null;

  //   const string = this._string.slice(this._cursor);

  //   // Track the first match found
  //   let firstMatch = null;

  //   for (const rule of this._rules) {
  //     const regex = new RegExp(rule.pattern);
  //     const match = string.match(regex);

  //     if (
  //       match &&
  //       ((!firstMatch || match.index) ??
  //         Infinity < firstMatch.index ??
  //         Infinity)
  //     ) {
  //       firstMatch = {
  //         type: rule.type,
  //         value: match[0],
  //         index: match.index ?? 0, // Default to 0 if match.index is undefined
  //       };
  //     }
  //   }
  //   if (firstMatch) {
  //     // Move cursor to the position after the first match
  //     this._cursor += firstMatch.index + firstMatch.value.length;
  //     return {
  //       type: firstMatch.type,
  //       value: firstMatch.value,
  //     };
  //   }

  //   // If no match is found, move cursor to the next character
  //   this._cursor++;
  //   return null;
  // }
  getNextToken() {
    if (!this.hasMoreTokens()) return null;

    this._string = this._string.slice(this._cursor);
    let matches: any[] = [];

    for (const [index, rule] of this._rules) {
      if (rule.ignore) continue;
      const regex = new RegExp(rule.pattern);
      const match = this._string.match(regex);

      if (
        match
        // !matches.some((prevMatch) => prevMatch.index === match.index)
      ) {
        matches.push({
          type: rule.type,
          value: match[0],
          index: match.index ?? 0,
        });
      }
    }

    // Sort matches by their index in ascending order
    matches.sort((a, b) => a.index - b.index);

    if (matches.length > 0) {
      const firstMatch = matches[0];

      this._cursor += firstMatch.value.length;
      return {
        type: firstMatch.type,
        value: firstMatch.value,
      };
    }

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
