/*
 * window resize handler
 */
define(function(){
	'use strict';

	function TransitionHandler(opts){
		this.$track = opts.$track;
		this.$phases = opts.$phases;
		this.scrollBoundaries = [];

		this.cachePhaseBoundaries();
	}

	TransitionHandler.prototype.cachePhaseBoundaries = function(){
		var self = this;

		this.$phases.each(function(){
			var $this = $(this);
			self.scrollBoundaries.push(
				{
					start: $this.data('start'),
					rest: $this.data('rest'),
					end: $this.data('end'),
					$el: $this,
					$animateables: $this.find('.animates')
				}
			);
		});
	};

	TransitionHandler.prototype.setBoundaryOut = function(boundary,percent){
		boundary.$animateables.each(function(){
			var $this = $(this),
				endtop = parseInt($this.data('endtop'),10) || false,
				endleft = parseInt($this.data('endleft'),10) || false,
				endright = parseInt($this.data('endright'),10) || false,
				endbottom = parseInt($this.data('endbottom'),10) || false,
				resttop = parseInt($this.data('resttop'),10) || false,
				restleft = parseInt($this.data('restleft'),10) || false,
				restright = parseInt($this.data('restright'),10) || false,
				restbottom = parseInt($this.data('restbottom'),10) || false,
				cssProperties = {};

			if(endright!==false){  cssProperties.right = Math.floor(restright + (endright * percent)); }
			if(endleft!==false){   cssProperties.left = Math.floor(restleft + (endleft * percent)); }
			if(endtop!==false){    cssProperties.top = Math.floor(resttop + (endtop * percent)); }
			if(endbottom!==false){ cssProperties.bottom = Math.floor(restbottom + (endbottom * percent)); }

			$this.css(cssProperties);
		});

	};

	TransitionHandler.prototype.setBoundaryIn = function(boundary,percent){
		boundary.$animateables.each(function(){
			var $this = $(this),
				starttop = parseInt($this.data('starttop'),10) || false,
				startleft = parseInt($this.data('startleft'),10) || false,
				startright = parseInt($this.data('startright'),10) || false,
				startbottom = parseInt($this.data('startbottom'),10) || false,
				resttop = parseInt($this.data('resttop'),10) || false,
				restleft = parseInt($this.data('restleft'),10) || false,
				restright = parseInt($this.data('restright'),10) || false,
				restbottom = parseInt($this.data('restbottom'),10) || false,
				cssProperties = {};

			if(startright!==false){  cssProperties.right = Math.floor(restright + (startright * percent)); }
			if(startleft!==false){   cssProperties.left = Math.floor(restleft + (startleft * percent)); }
			if(starttop!==false){    cssProperties.top = Math.floor(resttop + (starttop * percent)); }
			if(startbottom!==false){ cssProperties.bottom = Math.floor(restbottom + (startbottom * percent)); }

			$this.css(cssProperties);
		});

		boundary.$el.css({opacity: 1-percent});
	};

	TransitionHandler.prototype.setBoundaryRest = function(boundary){
		var self = this;

		_(this.scrollBoundaries).each(function(b){
			if(b.$el!==boundary.$el){
				self.hideBoundary(b);
			}
		});
	};

	TransitionHandler.prototype.hideBoundary = function(boundary){
		boundary.$el.css({
			display: 'none'
		});
	};
	TransitionHandler.prototype.showBoundary = function(boundary){
		boundary.$el.css({
			display: 'block'
		});
	};

	TransitionHandler.prototype.bind = function(){
		var self = this;

		this.$track.scroll(function(){
			var $this = $(this),
				lastLeft = window.parseInt($this.data('lastleft'),10) || 0,
				scrollLeft = parseInt($(this).scrollLeft(),10),
				direction = scrollLeft > lastLeft,
				perc;

			_(self.scrollBoundaries).each(function(boundary){
				if(scrollLeft>boundary.start && scrollLeft<boundary.rest){

					// play boundary in
					perc = (scrollLeft - boundary.rest)/(boundary.start - boundary.rest);
					self.setBoundaryIn(boundary,perc);
					if(perc>0.95 && !direction){
						self.hideBoundary(boundary);
					}else if(perc>0.05 && direction){
						self.showBoundary(boundary);
					}

				}else if(Math.abs(scrollLeft-boundary.rest) < 20){
					self.setBoundaryRest(boundary);
				}else if(scrollLeft>boundary.rest && scrollLeft<boundary.end){

					// play boundary out
					perc = (scrollLeft - boundary.rest)/(boundary.end - boundary.rest);
					self.setBoundaryOut(boundary,perc);

					if(perc>0.95 && direction){
						self.hideBoundary(boundary);
					}else if(perc>0.05 && !direction){
						self.showBoundary(boundary);
					}

				}
			});

			$this.data('lastleft',scrollLeft);
		});
	};

	return TransitionHandler;

});