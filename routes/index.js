var db = require("../database");
module.exports = (function(){
	var routes = {
		index: function(req, res){
			db.getBooks().then(function(item){
				console.log(item)
			})
			res.render("index.html");
		}
	};
	return routes;
}())