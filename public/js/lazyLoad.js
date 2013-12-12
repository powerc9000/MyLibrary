window.lazy = (function(){
	var els = toArray(document.querySelectorAll("[data-lazy]"));
	document.addEventListener("scroll", handleScroll);
	window.onload = handleScroll
	function handleScroll(){
		[].forEach.call(els, function(el){
			loadIfVisible(el);
		});
	}
	function loadIfVisible(el){
		if(checkvisible(el) && !el.getAttribute("data-lazy-loaded")){
			el.src = el.getAttribute("data-lazy");
			el.setAttribute("data-lazy-loaded", true);
		}
	}
	function posY(elm) {
		var test = elm, top = 0;
		while(!!test && test.tagName.toLowerCase() !== "body") {
			top += test.offsetTop;
			test = test.offsetParent;
		}

		return top;
	}

	function viewPortHeight() {
		var de = document.documentElement;

		if(!!window.innerWidth)
		{ return window.innerHeight; }
		else if( de && !isNaN(de.clientHeight) )
		{ return de.clientHeight; }

		return 0;
	}

	function scrollY() {
		if( window.pageYOffset ) { return window.pageYOffset; }
		return Math.max(document.documentElement.scrollTop, document.body.scrollTop);
	}

	function checkvisible( elm ) {
		var vpH = viewPortHeight(), // Viewport Height
			st = scrollY(), // Scroll Top
			y = posY(elm);

		return (y < (vpH + st));
	}
	function toArray(obj) {
	  var array = [];
	  // iterate backwards ensuring that length is an UInt32
	  for (var i = obj.length >>> 0; i--;) { 
		array[i] = obj[i];
	  }
	  return array;
	}
	return{
		register:function(el){
			loadIfVisible(el);
			els.push(el);
		},
		reload: function(el){
			handleScroll();
		},
		remove: function(el){
			els.forEach(function(e, i){
				if(e === el){
					els.splice(i,1);
				}
			})
		}
	}
}())