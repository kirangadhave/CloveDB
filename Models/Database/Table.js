/* jshint esversion: 6 */

module.exports = class Table{
    constructor(name){
        this.Name           = name;
        this.TableSchema    = {};
        this.Rows           = [];
        this.AlterFlag      = true;
    }

    CreateTable(tableSchema){
        if(this.AlterFlag){
            this.TableSchema = tableSchema;
            this.AlterFlag = false;
        } else {
            var err = {
                ExecptionName : "TableExistsExecption",
                Message: "Please use alter query"
            };
            throw err;
        }
    }

    ShowTable(){
        var length = 0;
        for(let p in this.TableSchema){
            if(p.length > length)
                length = p.length;
        }
        length = length + 5;
        var headerString = "|";
        for(let p in this.TableSchema){
            headerString = headerString + p;
            for(var i=0; i<(length - p.length); i++)
                headerString = headerString + " ";
            headerString += "|";
        }
        console.log(headerString);
    }

};
