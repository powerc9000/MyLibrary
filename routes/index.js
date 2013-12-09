module.exports = (function(){
	var routes = {
		index: function(req, res){
			res.render("index.html");
		}
	};
	return routes;
}())