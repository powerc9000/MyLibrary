var db = require("../database");
module.exports = (function(){
	var routes = {
		index: function(req, res){
			
			res.render("index.html");
		},
		getAll: function(req, res){
			db.getBooks().then(function(item){
				res.send(item);
			})
		},
		addBook: function(req, res){
			var book = req.body.book;
			db.addBook(book).then(function(){
				res.send(200);
			}, function(message){
				res.send(message, 406);
			})
		},
		checkout: function(req, res){
			var bookId = req.params.bookId;
			db.checkout(bookId).then(function(){
				res.send(200);
			}, function(message){
				res.send(message, 409);
			})
		},
		checkin: function(req, res){
			var bookId = req.params.bookId;
			db.checkin(bookId).then(function(){
				res.send(200);
			}, function(message){
				res.send(message, 409);
			})
		}
	};
	return routes;
})