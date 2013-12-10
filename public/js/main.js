angular.module("library", [])
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
function lookup($scope, $http){
	$scope.book = {};
	$scope.ran = false;
	$scope.loading = false;
	$scope.lookupISBN = function(){
		$scope.loading = true;
		ISBN = ISBNLookupForm.ISBN.value;
		$http.jsonp("https://www.googleapis.com/books/v1/volumes?q="+ISBN+"&callback=JSON_CALLBACK").success(function(data){
			console.log(data);
			$scope.loading = false;
			$scope.ran = true;
			console.log(typeof data);
			$scope.totalItems = data.totalItems;
			$scope.books = data.items;
		})
	}
}