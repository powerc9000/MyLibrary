var routes = require("./routes/index.js");
module.exports = function(){
	routes = routes.call(this);
	this.post("/api/book/add", routes.addBook);
	this.get("/api/books/all", routes.getAll);
	this.get("/*", routes.index);
}