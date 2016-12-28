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
            .command("db_init", "Starts Database", function(yargs){
                yargs.options({
                    login:{
                        demand: true,
                        alias: 'u',
                        type: 'string'
                    },
                    password:{
                        alias: 'p',
                        type: 'string'
                    }
                }).help('help');
            }).help('help')
            .argv;

/*
    Runs the main loop to keep reading user input.
*/
var get_query = function(){
    rl.on('line', (input) => {
        console.log(input);
    });
};

var Database = require("./Models/Database/Database.js");

/*
    Validate the entered password and starts the main loop.
*/
var validate = function(){
    //get_query();
    var d = new Database("Test");
    d.AddTable("Table 1");
    d.AddTable("Table 2");
    d.AddTable("Table 3");
    d.AddTable("Table 4");
    console.log(d);
    d.DeleteTable("Table 1");
    console.log(d);
};

/*
    First function to check if password is entered. If not then prompted.
*/
var check_password = function(argv){
    if(argv.password === undefined){
        rl.question("Enter Password: ", function(input){
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
