var Q = require("q");
	Client = require('mongodb').MongoClient,
	Server = require('mongodb').Server,
	DB = new Client(new Server("localhost", 27017, {}), {native_parser: false});
	
	module.exports = (function(){
		return{
			getBooks: function(){
				var q = Q.defer();
				DB.open(function(err, client){
					var db = client.db("books");
					var collection = db.collection("books");
					collection.find().toArray(function(err, item){
						q.resolve(item);
						DB.close();
					})
				})
				return q.promise;
			}
		}
	}())