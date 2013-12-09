module.exports = (function(){
	var routes = {
		index: function(req, res){
			res.send("hi");
		}
	};
	return routes;
}())