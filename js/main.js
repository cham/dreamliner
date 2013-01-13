require(['lib/dependencyLoader'],

function(dependencyLoader){
	'use strict';

	dependencyLoader(function(){

		$(window).resize(function(){
			var ww = $(window).width(),
				wh = $(window).height(),
				dw = $(document).width(),
				dh = $(document).height(),
				widthBigger = ww > wh,
				ratio = widthBigger ? ww/wh : wh/ww;

			$('.phase').css({
				width: ww,
				height: dh
			});
			$('.scaledbackground').each(function(){
			});

		}).trigger('resize');

	});
});