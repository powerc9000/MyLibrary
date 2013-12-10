angular.module("library", [])

function lookup($scope, $http){
	$scope.book = {};
	$scope.lookupISBN = function(){
		ISBN = ISBNLookupForm.ISBN.value;
		$http.jsonp("https://www.googleapis.com/books/v1/volumes?q=isbn:"+ISBN+"&callback=JSON_CALLBACK").success(function(data){
			console.log(typeof data);
			$scope.book = data.items[0].volumeInfo;
		})
	}
}