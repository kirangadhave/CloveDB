/* jshint esversion: 6 */
var Table = require('./Table.js');

module.exports = class Database{
    constructor(name){
        this.Name = name;
        this.Tables = [];
    }

    AddTable(tableName){
        var t = new Table(tableName);
        this.Tables.push(t);
    }

    DeleteTable(tableName){
        var temp = this;
        var index = -1;
        this.Tables.forEach(function(t){
            if(t.Name === tableName)
                index = temp.Tables.indexOf(t);
        });
        this.Tables.splice(index,1);
    }
};
