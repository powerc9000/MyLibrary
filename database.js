var Client = require('mongodb').MongoClient,
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
			},
			addBook: function(data){
				var q = Q.defer();
				DB.open(function(err, client){
					var db = client.db("books");
					var c = db.collection("books");
					c.findOne({id:data.id}, function(err, item){
						if(item){
							q.reject("Book Already in Library");
						}else{
							c.insert(data, function(err, records){
								q.resolve("success");
							})
						}
						DB.close();
					})
				});
				return q.promise;
			}
		}
	}())