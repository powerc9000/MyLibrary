angular.module("library", ["ngRoute", "ngAnimate"])
.config(function($routeProvider, $locationProvider){
	$locationProvider.html5Mode(true);
	$routeProvider.when("/add", {templateUrl:"/partials/addBooks.html", controller:"lookup"})
	.when("/", {templateUrl:"/partials/home.html", controller:"home", reloadOnSearch:false})
	.when("/book/:bookId", 
		{
			templateUrl:"/partials/book.html", 
			controller:"bookSingle"
		}
	)
	.when("/author/:author", {templateUrl:"/partials/home.html", controller:"authorSingle"})
}).run(function($rootScope, $q, $http){
	var q = $q.defer();
	console.log("promise")
	$rootScope.dataLoaded = q.promise;
	$http.get("/api/books/all").success(function(data){
		console.log("run ran")
		$rootScope.library = data;
		q.resolve();
	})

	return q.promise;
})
.factory("loader", function($rootScope){
	return {
		show: function(){
			$rootScope.loading = true;
		},
		hide: function(){
			$rootScope.loading = false;
		}
	}
})
.factory("addBook", function($rootScope){
	return function(book){
			$rootScope.library.push(book);
		
	}
})
.factory("checkout", function($http){
	return function(book, name){
		console.log("hey")
		$http.get("/api/book/"+book.id+"/checkout?name="+name)
		.success(function(){
			alertify.log("Book has been checked out successfully");
			book.checkedIn = 0;
			book.checkedOutTo = name;
		}).error(function(message){
			alertify.alert(message);
		})
	}
})
.factory("checkin", function($http){
	return function(book){
		console.log(book)
		$http.get("/api/book/"+book.id+"/checkin")
		.success(function(){
			alertify.log("Book has been checked in successsfully");
			book.checkedIn = 1;
		}).error(function(message){
			alertify.alert(message);
		})
	}
})
.factory("getBook", function($rootScope, $q){
	return function(bookId){

		var book,
			q = $q.defer();
		$rootScope.dataLoaded.then(function(){
			$rootScope.library.forEach(function(b){
				if(b.id === bookId){
					book = b;
				}
			});
			q.resolve(book);
		})
		return q.promise;
	}
})
.factory("getAuthor", function($rootScope, $q){
	return function(author){
		var books = [],
			q = $q.defer();
			$rootScope.dataLoaded.then(function(){
				$rootScope.library.forEach(function(b){
					b.authors && b.authors.forEach(function(a){
						if(a === author){
							books.push(b)
						}
					})
				})
				q.resolve(books);
			});
			return q.promise;
	}
})
.animation(".animated", function($timeout){
	return{
		enter: function(el, done){
			el[0].classList.remove("fadeOut");
			el[0].classList.add("wobble", "fadeIn");
			done()
		},
		leave: function(el, done){
			el[0].classList.remove("flip");
			el[0].classList.add("fadeOut");
			done()
		}
	}
})
.directive("lazy", function($timeout){
	return {
		link: function(scope, el, attrs){
			var watcher = attrs.lazyWatch || "books"
			el.bind("$destroy", function(){
				lazy.remove(el[0]);
			});
			scope.$watch(watcher, function(){
				$timeout(function(){
					lazy.register(el[0]);
				},100)
				
			})
			scope.$watch("books", function(){
				$timeout(function(){
					lazy.register(el[0]);
				},100)
				
			})
			scope.$watch("order", function(){
				$timeout(function(){
					lazy.reload();
				},100)
				
			})
		}
	}
})
.directive("coolLoader", function(){
	return function(scope, el, attr){
		var interval;
		var count = 0;
		scope.$watch(attr.ngShow, function(val){
			if(val){
				count = 0;
				clearInterval(interval);
				interval = setInterval(function(){
					el.text("Loading"+new Array(count+1).join("."));
					count = (count+1) % 4;
				}, 200);
			}else{
				clearInterval(interval);
			}
		})
	}
})
function home($scope, $location, checkout){
	$scope.order = "title"
	$scope.viewType=$location.search()["list-view"] || "grid";
	$scope.setViewType = function(type){
		$scope.viewType = type;
		$location.search("list-view", type);
	}
}
function lookup($scope, $http, addBook){
	$scope.book = {};
	$scope.ran = false;
	$scope.loading = false;
	$scope.lookupISBN = function(){
		$scope.loading = true;
		ISBN = ISBNLookupForm.ISBN.value;
		$http.jsonp("https://www.googleapis.com/books/v1/volumes?q="+ISBN+"&callback=JSON_CALLBACK&key=AIzaSyCFOpMunhae0X4MMe1SN06YqnZD7CYsQl8").success(function(data){
			$scope.books = data.items;
			data.items.forEach(function(b, idx){
				$scope.library.forEach(function(c){
					if(b.id === c.id){
						b.added = true;

						console.log("heyo", b)
					}
				})
			})
			$scope.loading = false;
			$scope.ran = true;
			console.log(typeof data);
			$scope.totalItems = data.totalItems;
			
		})
	}
	$scope.addToLibrary = function(){
		var that = this;
		this.loading = true;
		this.book.volumeInfo.id = this.book.id;
		this.book.volumeInfo.checkedIn = 1;
		$http.post("/api/books/add", {book:this.book.volumeInfo}).success(function(){
			that.loading = false;
			that.book.added = true;
			addBook(that.book.volumeInfo);
			alertify.log("Book added to library");
		}).error(function(message){
			that.loading = false;
			that.book.added = true;
			alertify.alert(message);
		});
			
		
	}
}

function bookSingle($scope, $routeParams, getBook, loader, checkout, checkin){
	var bookId = $routeParams.bookId;
	$scope.loading = true;
	console.log(checkout)
	$scope.checkout = checkout;
	$scope.checkin = checkin;
	getBook(bookId).then(function(b){
		$scope.book = b;
		$scope.loading = false;
	});
}

function authorSingle($scope, $routeParams, getAuthor, $location){
	var author = $routeParams.author;
	$scope.author = author;
	$scope.order = "title"
	$scope.viewType=$location.search()["list-view"] || "grid";
	$scope.setViewType = function(type){
		$scope.viewType = type;
		$location.search("list-view", type);
	}
	getAuthor(author).then(function(books){
		console.log(books)
		$scope.library = books;
	});
}