/*jshint esversion: 6 */

const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

/*
    Configure yargs
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

var get_query = function(){
    rl.on('line', (input) => {
        console.log(input);
    });
};

var validate = function(){
    get_query();
};

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

check_password(argv);
