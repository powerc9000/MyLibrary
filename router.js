var routes = require("./routes/index.js");
module.exports = function(){
	routes = routes.call(this);
	
	this.get("/api/book/:bookId/checkout", routes.checkout);
	this.get("/api/book/:bookId/checkin", routes.checkin);
	this.post("/api/books/add", routes.addBook);
	this.get("/api/books/all", routes.getAll);
	this.get("/*", routes.index);
}