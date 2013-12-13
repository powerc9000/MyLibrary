
	
	module.exports = (function(){
		var Client = require('mongodb').MongoClient,
			Server = require('mongodb').Server,
			promise = require("q").defer(),
			db = promise.promise;
			Client.connect("mongodb://127.0.0.1:27017/books", function(err, con){
				promise.resolve(con);
			})
		return{
			getBooks: function(){
				var q = Q.defer();
				db.then(function(client){
					var collection = client.collection("books");
					collection.find().toArray(function(err, item){
						q.resolve(item);
					})
				})
				return q.promise;
			},
			addBook: function(data){
				var q = Q.defer();
				db.then(function(client){
					var c = client.collection("books");
					c.findOne({id:data.id}, function(err, item){
						if(item){
							q.reject("Book Already in Library");
						}else{
							c.insert(data, function(err, records){
								q.resolve("success");
								
							})
						}
					})
				});
				return q.promise;
			},
			checkout: function(bookId){
				var q = Q.defer();
				db.then(function(client){
					var c = client.collection("books");
					c.findOne({id:bookId}, function(err, item){
						if(item.checkedIn === 1){
							c.update({id:bookId}, {$set: {checkedIn:0}}, function(err, count){
								if(err){
									q.reject("An error occured");
								}else{
									q.resolve();
								}
							})
						}else{
							q.reject("Book is already checkout!");
						}
					});
				});
				return q.promise;
			},
			checkin: function(bookId){
				var q = Q.defer();
				db.then(function(client){
					var c = client.collection("books");
					c.findOne({id:bookId}, function(err, item){
						if(item.checkedIn === 0){
							c.update({id:bookId}, {$set: {checkedIn:1}}, function(err, count){
								if(err){
									q.reject("An error occured");
								}else{
									q.resolve();
								}
							})
						}else{
							q.reject("Book is already checked in!");
						}
					});
				});
				return q.promise;
			}
		}
	}())