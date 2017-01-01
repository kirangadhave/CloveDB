/* jshint esversion: 6 */

/*
    Import readline module for user input and output.
*/
const readline = require('readline');

/*
    Configure readline to use stdin and stdout.
*/
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

/*
    Configure yargs for command line arguments
*/
var argv = require('yargs')
    .command("db_init", "Starts Database", function(yargs) {
        yargs.options({
            login: {
                demand: true,
                alias: 'u',
                type: 'string'
            },
            password: {
                alias: 'p',
                type: 'string'
            }
        }).help('help');
    }).help('help')
    .argv;
var d;
/*
    Runs the main loop to keep reading user input.
*/
var get_query = function() {
    rl.on('line', (c) => {
        var IS = new InputStream(c);
        var lex = new Lexer(IS);
        console.log(lex.Read_Number());
    });
};

var Database = require("./Models/Database/Database.js");
var Table = require("./Models/Database/Table.js");
var InputStream = require("./JPSQL/InputStream.js");
var Lexer = require("./JPSQL/Lexer.js");
/*
    Validate the entered password and starts the main loop.
*/
var validate = function() {
    get_query();
};

/*
    First function to check if password is entered. If not then prompted.
*/
var check_password = function(argv) {
    if (argv.password === undefined) {
        rl.question("Enter Password: ", function(input) {
            argv.password = input;
            validate();
        });
    } else {
        validate();
    }
};

/*
    First function call.
*/
check_password(argv);


/*

if(c.split(" ")[0] === "create" && c.split(" ")[1] === "database"){
    let a = c.split(" ")[2];
    d = new Database(a);
    console.log(d);
}

if(c.split(" ")[0] === "create" && c.split(" ")[1] === "table"){
    let a = c.split(" ");
    var t = new Table(a[2]);
    var schema = {};
    for(i=4; i<a.length; i++){
        schema[a[i]] = "";
    }
    t.CreateTable(schema);
    d.AddTable(t);
    console.log(t);
}

if(c.split(" ")[0] === "show"){
    var name = c.split(" ")[2];

    d.Tables[0].ShowTable();
}


*/