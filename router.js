var routes = require("./routes/index.js")
module.exports = function(){
	this.get("/*", routes.index);
}