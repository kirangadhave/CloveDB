var fs = require('fs');
var Command = require('./States.js').Command;
var Entity = require('./States.js').Entity;

module.exports = class Execute {
	constructor(query){
		this.Query = query;
		this.SelectedCommand = "";
		this.SelectedEntity = "";
	}
}