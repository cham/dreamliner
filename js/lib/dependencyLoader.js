define(function(){
	'use strict';

	var paths = {
		jquery: 'js/lib/jquery-1.8.3',
		underscore: 'js/lib/underscore-min-1.4.3',
		scrollTo: 'js/lib/jquery.scrollTo.js',
		mousewheel: 'js/lib/jquery.mousewheel.js'
	};

	/*
	 * provides CDN fallback for jquery and underscore
	 */
	return function dependencyLoader(onloaded){
		var deps = [];

		window.$ = window.jQuery;
		if(!window.$){
			deps.push(paths.jquery);
		}
		if(!window._){
			deps.push(paths.underscore);
		}
		if(!window.$ || !window.$.fn.scrollTo){
			deps.push(paths.scrollTo);
		}
		if(!window.$ || !window.$.fn.mousewheel){
			deps.push(paths.mousewheel);
		}

		if(!deps.length){
			onloaded();
			return;
		}

		require(deps,function(){
			onloaded();
		});
	};
});