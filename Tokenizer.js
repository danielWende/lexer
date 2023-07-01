class Tokenizer {
  init(string) {
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
    //Numbers:

    if (Number.isNaN(Number(string[this._cursor]))) {
      let number = "";
      while (!Number.isNaN(Number(string[this._cursor]))) {
        number += string[this._cursor++];
      }
      return {
        type: "NUMBER",
        value: number,
      };
    }

    return null;
  }
}
module.exports = {
  Tokenizer,
};
