define(function(){
	'use strict';

	var isTouchDevice = function(){
			var el = document.createElement('div');
			el.setAttribute('ontouchstart', 'return;');
			return typeof el.ontouchstart == "function";
		}(),
		numphases = 7;

	function Navigation(opt){
		this.$trackinner = opt.$trackinner;
		this.$track = opt.$track;
		this.$navlinks = opt.$navlinks;

		this.currentIndex = 0;
	}

	Navigation.prototype.updateNavPositions = function(boundaries){
		this.$navlinks.each(function(i){
			$(this).data('navpos',boundaries[i]);
		});
	};

	Navigation.prototype.moveLeft = function(){
		if(this.currentIndex<1){
			return;
		}
		this.$navlinks.filter(':eq('+(this.currentIndex-1)+')').trigger('click');
	};

	Navigation.prototype.moveRight = function(){
		if(this.currentIndex>=this.$navlinks.length){
			return;
		}
		this.$navlinks.filter(':eq('+(this.currentIndex+1)+')').trigger('click');
	};

	Navigation.prototype.updateIndex = function(){
		var scrollLeft = this.$track.scrollLeft(),
			lastLeft = 0,
			hitArea = 100;

		this.$navlinks.each(function(i){
			if(parseInt($(this).data('navpos'),10)<(scrollLeft+hitArea)){
				lastLeft = i;
			}
		});

		this.currentIndex = lastLeft;

		this.$navlinks.filter('.active').removeClass('active');
		this.$navlinks.filter(':eq('+this.currentIndex+')').addClass('active');
	};

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

			speed = 1500 * indexDiff;

			if(isTouchDevice){ speed = speed * 2; }

			self.$track.stop(true);
			self.$track.scrollTo($(this).data('navpos'), speed);//, {axis:'x',easing:'linear'});
			self.currentIndex = index;

		});

		this.$track.scroll(function(){
			self.updateIndex();
		});
	};

	return Navigation;

});