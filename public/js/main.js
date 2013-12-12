angular.module("library", ["ngRoute"])
.config(function($routeProvider, $locationProvider){
	$locationProvider.html5Mode(true);
	$routeProvider.when("/add", {templateUrl:"/partials/addBooks.html", controller:"lookup"})
	.when("/", {templateUrl:"/partials/home.html", controller:"home"})
}).run(function($rootScope, $q, $http){
	var q = $q.defer();	
	$http.get("/api/books/all").success(function(data){
		$rootScope.library = data;
		q.resolve();
	})

	return q.promise;
})
.directive("masonry", function($parse, $timeout) {
		var masonry;
		return {
			restrict: 'AC',
			link: function (scope, elem, attrs) {
				masonry = new Masonry(elem[0], { itemSelector: '.book-listing'})
				//elem.masonry({ itemSelector: '.book-listing'});
				// Opitonal Params, delimited in class name like:
				// class="masonry:70;"
				//elem.masonry({ itemSelector: '.masonry-item', columnWidth: 140, gutterWidth: $parse(attrs.masonry)(scope) });
			},
			controller : function($scope,$element){
					var bricks = [];
					this.appendBrick = function(child, brickId, waitForImage){
						function addBrick() {
							masonry.appended(child, true);
							$scope.$evalAsync(function(){
								willReload = false;
								masonry.layout("reload");
							});
							// If we don't have any bricks then we're going to want to 
						}

						if (waitForImage) {
							imagesLoaded(child, addBrick);			
						} else {
							addBrick();
						}
					};

					// Removed bricks - we only want to call masonry.reload() once
					// if a whole batch of bricks have been removed though so push this
					// async.
					var willReload = false;
					function hasRemovedBrick() {
						if (!willReload) {
							willReload = true;
							$scope.$evalAsync(function(){
								willReload = false;
								
							});
						}
					}

					this.removeBrick = function(brickId, elem){
							//hasRemovedBrick();
							$scope.$evalAsync(function(){
								willReload = false;
								masonry.layout("reload");
							});
							masonry.remove(elem);
							
							
					};
			}
		};		 
	})
	.directive('masonryBrick', function ($compile) {
		return {
			restrict: 'AC',
			require : '^masonry',
			link: function (scope, elem, attrs, MasonryCtrl) {

			imagesLoaded(elem, function () {
				MasonryCtrl.appendBrick(elem, scope.$id, true);
			});

			scope.$on("$destroy",function(){
					MasonryCtrl.removeBrick(scope.$id, elem);
			}); 
		}
	};
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
	
}
function lookup($scope, $http){
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
			$scope.library.push(that.book.volumeInfo);
			alertify.log("Book added to library");
		}).error(function(message){
			that.loading = false;
			that.book.added = true;
			alertify.alert(message);
		});
			
		
	}
}