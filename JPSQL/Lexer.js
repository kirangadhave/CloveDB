/* jshint esversion: 6 */

var fs = require('fs');

module.exports = class Lexer {
    GetKeywords() {
        var a = fs.readFileSync("./JPSQL/KeywordsFile", "utf8").split('\n');
        a.pop();
        return a;
    }

    GetOperators() {
        var a = fs.readFileSync("./JPSQL/OperatorsFile", "utf8").split('\n');
        a.pop();
        return a;
    }

    constructor(inputStream) {
        this.IS = inputStream;
        this.current = null;
        this.Keywords = this.GetKeywords();
        this.Operators = this.GetOperators();
    }

    Is_Keyword(word) {
        return this.Keywords.includes(word);
    }

    Is_Digit(char) {
        return /[0-9]/i.test(char);
    }

    Is_Punctuation(char) {
        return ".,;(){}[]".split("").includes(char);
    }

    Is_Whitespace(char) {
        return " \t\n".split("").includes(char);
    }

    Is_ID_Start(char) {
        return /[a-z]/i.test(char);
    }

    Is_ID(char) {
        return Is_ID_Start(char) || "?!-<>=0123456789".split("").inlcudes(char);
    }

    Is_Operator(char) {
        return this.Operators.includes(char);
    }

    Read_While(predicate) {
        var str = "";
        while (!this.IS.EOF() && predicate(this.IS.Peek()))
            str += this.IS.Next();
        return str;
    }

    Read_Number() {
        var t = this;
        var has_dot = false;
        var number = this.Read_While(function(char) {
            if (char === ".") {
                if (has_dot)
                    return false;
                has_dot = true;
                return true;
            }
            return t.Is_Digit(char);
        });
        return {
            type: "num",
            value: parseFloat(number)
        };
    }

    Read_Ident() {
        var id = this.Read_While(this.Is_Id);
        return {
            type: this.Is_Keyword(id) ? "kw" : "var",
            value: id
        };
    }

    Read_Escaped(end) {
        var esc = false,
            str = "";
        this.IS.Next();
        while (this.IS.EOF()) {
            var char = this.IS.Next();
            if (esc) {
                str += char;
                esc = false;
            } else if (char === "\\") {
                esc = true;
            } else if (char == end) {
                break;
            } else {
                str += char;
            }
        }
        return str;
    }

    Read_String() {
        return {
            type: "str",
            value: this.Read_Escaped('"')
        };
    }

    Skip_Comment() {
        this.Read_While(function(char) {
            return char != "\n";
        });
        this.IS.Next();
    }

    Read_Next() {
        this.Read_While(this.Is_Whitespace);
    }

};

