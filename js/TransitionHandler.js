/*
 * transition handler
 */
define(function(){
	'use strict';

	function TransitionHandler(opts){
		this.$track = opts.$track;
		this.$phases = opts.$phases;
		this.$phraseWrappers = opts.$phraseWrappers;
		this.baseDims = opts.baseDims;

		this.scrollBoundaries = [];
		this.scale = 1;
		this.wrapperTopMargin = 0;

		this.cachePhaseBoundaries();
	}

	TransitionHandler.prototype.cachePhaseBoundaries = function(){
		var self = this;

		this.$phases.each(function(i){
			var $this = $(this);
			self.scrollBoundaries.push(
				{
					start: $this.data('start'),
					rest: $this.data('rest'),
					end: $this.data('end'),
					$el: $this,
					$animateables: $this.find('.animates'),
					shown: false,
					id: i
				}
			);
		});
		this.scrollBoundaries[0].shown = true;
	};

	TransitionHandler.prototype.updatePhraseBoundaries = function(newBoundaries){
		_(this.scrollBoundaries).each(function(boundary,i){
			boundary.start = newBoundaries[i-1] || 0;
			boundary.rest = newBoundaries[i];
			boundary.end = newBoundaries[i+1] || newBoundaries[i];
		});
	};

	TransitionHandler.prototype.setBoundaryOut = function(boundary,percent){
		var self = this,
			opacity = 1 - (Math.pow(percent, 3));

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

			if(endright!==false){  cssProperties.right = Math.floor((restright + (endright * percent))*self.scale); }
			if(endleft!==false){   cssProperties.left = Math.floor((restleft + (endleft * percent))*self.scale); }
			if(endtop!==false){    cssProperties.top = Math.floor((resttop + (endtop * percent))*self.scale); }
			if(endbottom!==false){ cssProperties.bottom = Math.floor((restbottom + (endbottom * percent))*self.scale); }

			$this.css(cssProperties);
		});

		boundary.$el.css({opacity: opacity});
	};

	TransitionHandler.prototype.setBoundaryIn = function(boundary,percent){
		var self = this,
			opacity = 1 - (Math.pow(percent, 3));

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

			if(startright!==false){  cssProperties.right = Math.floor((restright + (startright * percent))*self.scale); }
			if(startleft!==false){   cssProperties.left = Math.floor((restleft + (startleft * percent))*self.scale); }
			if(starttop!==false){    cssProperties.top = Math.floor((resttop + (starttop * percent))*self.scale); }
			if(startbottom!==false){ cssProperties.bottom = Math.floor((restbottom + (startbottom * percent))*self.scale); }

			$this.css(cssProperties);
		});

		boundary.$el.css({opacity: opacity});
	};

	TransitionHandler.prototype.hideAllBoundariesExcept = function(boundary){
		var self = this;

		_(this.scrollBoundaries).each(function(b){
			if(b.id !== boundary.id){
				self.hideBoundary(b);
			}
		});
	};

	TransitionHandler.prototype.hideBoundary = function(boundary){
		if(!boundary.shown){return;}
		boundary.$el.css({
			display: 'none'
		});
		boundary.shown = false;
	};
	TransitionHandler.prototype.showBoundary = function(boundary){
		if(boundary.shown){return;}
		boundary.$el.css({
			display: 'block'
		});
		boundary.shown = true;
	};

	TransitionHandler.prototype.setScale = function(scale,wrapperTopMargin){
		this.scale = scale;
		this.wrapperTopMargin = wrapperTopMargin;
	};

	TransitionHandler.prototype.bind = function(){
		var self = this;

		this.$track.scroll(function(){
			var $this = $(this),
				lastLeft = self.lastLeft || 0,
				scrollLeft = parseInt($this.scrollLeft(),10),
				direction = scrollLeft > lastLeft;


			scrollLeft = Math.min(Math.max(scrollLeft,0),self.scrollBoundaries[self.scrollBoundaries.length-1].end);

			_(self.scrollBoundaries).each(function(boundary){
				if(scrollLeft>boundary.start && scrollLeft<boundary.rest){

					// play boundary in
					var perc = (scrollLeft - boundary.rest)/(boundary.start - boundary.rest);
					self.setBoundaryIn(boundary,perc);

					if(perc>0.975 && !direction){
						self.hideBoundary(boundary);
					}else if(perc>0.5 && direction){
						self.showBoundary(boundary);
					}

				}else if(scrollLeft>boundary.rest && scrollLeft<boundary.end){

					// play boundary out
					var perc = (scrollLeft - boundary.rest)/(boundary.end - boundary.rest);
					self.setBoundaryOut(boundary,perc);

					if(perc>0.975 && direction){
						self.hideBoundary(boundary);
					}else if(perc>0.5 && !direction){
						self.showBoundary(boundary);
					}

				}else if(Math.abs(scrollLeft-boundary.rest)>10){

					self.hideBoundary(boundary);

				}
			});

			self.lastLeft = scrollLeft;
		});
	};

	return TransitionHandler;

});