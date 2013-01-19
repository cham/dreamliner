define(function(){
	'use strict';

	function Navigation(opt){
		this.$trackinner = opt.$trackinner;
		this.$track = opt.$track;
		this.$navlinks = opt.$navlinks;

		this.currentIndex = 0;

		this.panelScrollStep = Math.floor(this.$trackinner.width() / 7);
	}

	Navigation.prototype.bind = function(){
		var self = this;

		this.$navlinks.click(function(e){
			var index,
				indexDiff,
				speed;

			e.preventDefault();
			e.stopPropagation();

			index = parseInt($(this).data('index'),10);
			indexDiff = index - self.currentIndex;

			if(indexDiff<0){
				indexDiff = Math.abs(indexDiff);
			}else if(indexDiff===0){
				return;
			}

			speed = 750 * indexDiff;

			self.$track.scrollTo(self.panelScrollStep * index, speed);
			self.currentIndex = index;
		});
	};

	return Navigation;

});