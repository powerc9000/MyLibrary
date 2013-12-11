angular.module("library", ["ngRoute"])
.config(function($routeProvider, $locationProvider){
	$locationProvider.html5Mode(true);
	$routeProvider.when("/add", {templateUrl:"/partials/addBooks.html", controller:"lookup"})
	.when("/", {templateUrl:"/partials/home.html", controller:"home"})
})
.directive("lazy", function(){
	return {
		link: function(scope, el, attrs){
			el.bind("$destroy", function(){
				lazy.remove(el[0]);
			});
			scope.$watch("books", function(){
				lazy.register(el[0]);
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
function home($scope){
	$scope.pizza = "john"
}
function lookup($scope, $http){
	$scope.book = {};
	$scope.ran = false;
	$scope.loading = false;
	$scope.lookupISBN = function(){
		$scope.loading = true;
		ISBN = ISBNLookupForm.ISBN.value;
		$http.jsonp("https://www.googleapis.com/books/v1/volumes?q="+ISBN+"&callback=JSON_CALLBACK&key=AIzaSyCFOpMunhae0X4MMe1SN06YqnZD7CYsQl8").success(function(data){
			console.log(data);
			$scope.loading = false;
			$scope.ran = true;
			console.log(typeof data);
			$scope.totalItems = data.totalItems;
			$scope.books = data.items;
		})
	}
	$scope.addToLibrary = function(){
		var that = this;
		this.loading = true;
		
			that.loading = false;
			that.added = true
		
	}
}