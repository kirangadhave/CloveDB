/* jshint esversion: 6 */

module.exports = class InputStream {
    constructor(input){
        this.Input  = input;
        this.Pos    = 0;
        this.Line   = 1;
        this.Col    = 0;
    }

    Next(){
        var ch = this.Input.charAt(this.Pos++);
        if(ch === "\n"){
            this.Line++;
            this.Col = 0;
        } else {
            this.Col++;
        }
        return ch;
    }

    Peek(){
        return this.Input.charAt(this.Pos);
    }

    EOF(){
        return this.Peek() === "";
    }

    Croak(msg){
        throw new Error(msg + "(" + this.Line + " : " + this.Col + ")");
    }

};
