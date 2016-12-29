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
            this.HeaderElement = tableSchema;
            this.AlterFlag = false;
        }
        else{
            var err = {
                ExecptionName : "TableExistsExecption",
                Message: "Please use alter query"
            };
            throw err;
        }
    };


};
