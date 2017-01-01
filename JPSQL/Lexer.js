/* jshint esversion: 6 */

var fs = require('fs');

/**
 * This module contains Lexer Class which takes an InputStream Object as parameter and performs various lexing functions
 */
module.exports = class Lexer {
    /**
     * GetKeywords reads KeywordsFile in JPSQL folder and loads an array of keywords into Lexer.Keywords
     */
    GetKeywords() {
        var a = fs.readFileSync("./JPSQL/KeywordsFile", "utf8").split('\n');
        a.pop();
        return a;
    }

    /**
     * GetKeywords reads OperatorsFile in JPSQL folder and loads an array of operators into Lexer.Operators
     */
    GetOperators() {
        var a = fs.readFileSync("./JPSQL/OperatorsFile", "utf8").split('\n');
        a.pop();
        return a;
    }

    /**
     * Constructor for Lexer Class.
     * inputStream - Takes in object of InputStream class.
     */
    constructor(inputStream) {
        this.IS = inputStream;
        this.current = null;
        this.Keywords = this.GetKeywords();
        this.Operators = this.GetOperators();
    }

    /**
     * Returns true only if 'word' is a keyword.
     */
    Is_Keyword(word) {
        return this.Keywords.includes(word);
    }

    /**
     * Returns true if regex match of 'char' with numbers is found.
     */
    Is_Digit(char) {
        return /[0-9]/i.test(char);
    }

    /**
     * Returns true if 'char' is a punctuation.
     * @param {[type]} char [description]
     */
    Is_Punctuation(char) {
        return ".,;(){}[]".split("").includes(char);
    }

    /**
     * Returns true if 'char' is a whitespace character.
     * @param {[type]} char [description]
     */
    Is_Whitespace(char) {
        return " \t\n".split("").includes(char);
    }

    /**
     *
     */
    Is_ID_Start(char) {
        return /[a-z]/i.test(char);
    }

    /**
     *
     */
    Is_ID(char) {
        return Is_ID_Start(char) || "?!-<>=0123456789".split("").inlcudes(char);
    }

    /**
     * Returns true if 'char' is an operator.
     */
    Is_Operator(char) {
        return this.Operators.includes(char);
    }

    /**
     * Reads the input stream while passed in boolean predicate function is true and input.EOF is not reached.
     * Returns the read string.
     */
    Read_While(predicate) {
        var str = "";
        while (!this.IS.EOF() && predicate(this.IS.Peek()))
            str += this.IS.Next();
        return str;
    }

    /**
     * Reads the string and returns parsed number.
     */
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

    /**
     * Returns if the given string token is 'var' or 'keyword'/
     */
    Read_Ident() {
        var id = this.Read_While(this.Is_Id);
        return {
            type: this.Is_Keyword(id) ? "kw" : "var",
            value: id
        };
    }

    /**
     * Reads escape characters.
     */
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

    /**
     * Reads strings
     */
    Read_String() {
        return {
            type: "str",
            value: this.Read_Escaped('"')
        };
    }

    /**
     * Skips commented code. Reads till end of line character.
     */
    Skip_Comment() {
        this.Read_While(function(char) {
            return char != "\n";
        });
        this.IS.Next();
    }

    /**
     * Calls the above functions as needed based on type of char being read.
     */
    Read_Next() {
        this.Read_While(this.Is_Whitespace);

        if(this.IS.EOF())
            return null;

        var char = this.IS.Peek();
        
        if(char === "#"){
            this.Skip_Comment();
            return this.Read_Next();
        }

        if(char === '"')
            return this.Read_String();

        if(this.Is_Digit(char))
            return this.Read_Number();

        if(this.Is_ID_Start(char))
            return this.Read_Ident();

        if(this.Is_Punctuation(char))
            return{
                type : "punc",
                value : this.IS.Next()
            };

        if(this.Is_Operator(char))
            return{
                type : "op",
                value : this.Read_While(this.Is_Operator)
            };

        this.IS.Croak("Cannot handle the character: " + char);
    }

    Peek(){
        return current || (current = this.Read_Next());
    }

    Next(){
        var tok = current;
        current = null;
        return tok || this.Read_Next();
    }

    EOF(){
        return this.Peek() === null;
    }
};