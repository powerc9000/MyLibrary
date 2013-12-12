angular.module("library", ["ngRoute", "ngAnimate"])
.config(function($routeProvider, $locationProvider){
	$locationProvider.html5Mode(true);
	$routeProvider.when("/add", {templateUrl:"/partials/addBooks.html", controller:"lookup"})
	.when("/", {templateUrl:"/partials/home.html", controller:"home", reloadOnSearch:false})
}).run(function($rootScope, $q, $http){
	var q = $q.defer();	
	$http.get("/api/books/all").success(function(data){
		$rootScope.library = data;
		q.resolve();
	})

	return q.promise;
})
.factory("addBook", function(){
	return function(book){
		$rootScope.library.push(book);
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
				console.log("heyo!")
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
function home($scope, $location){
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
		$http.post("/api/book/add", {book:this.book.volumeInfo}).success(function(){
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