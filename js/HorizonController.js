define(function(){
	'use strict';

	function HorizonController(opts){
		this.$track = opts.$track;
		this.$horizons = opts.$horizons;
		this.scale = 1;

		this.horizonPositions = [];
		this.margin = 0;
	}

	HorizonController.prototype.updatePositions = function(newBoundaries){
		var self = this;

		this.horizonPositions = [];
		_(newBoundaries).chain().first(4).each(function(boundary,i){
			self.horizonPositions.push({
				$el: $(self.$horizons.get(i)),
				start: newBoundaries[i-1] || 0,
				rest: boundary,
				end: newBoundaries[i+1] || boundary
			});
		});
	};

	HorizonController.prototype.scaleHorizonsTo = function(percent,boundary,direction,margin){
		var from, to, height;

		switch(direction){
			case 1:
				from = parseInt(boundary.$el.data('startbottom'),10);
				to = parseInt(boundary.$el.data('restbottom'),10);
				break;
			case 0:
				from = parseInt(boundary.$el.data('restbottom'),10);
				to = parseInt(boundary.$el.data('restbottom'),10);
				break;
			case -1:
				from = parseInt(boundary.$el.data('endbottom'),10);
				to = parseInt(boundary.$el.data('restbottom'),10);
				break;
		}

		height = Math.floor((to + ((to-from) * -percent)) * this.scale) + margin;
		this.$horizons.css({
			height: Math.max(height,0)
		});
	};

	HorizonController.prototype.setScale = function(s){
		this.scale = s;
	};

	HorizonController.prototype.resizeAll = function(topmargin){
		var self = this,
			scrollLeft = this.$track.scrollLeft(),
			perc,
			baseBoundary,
			direction,
			margin = topmargin || this.margin;

		_(this.horizonPositions).each(function(boundary){
			if(scrollLeft>boundary.start && scrollLeft<boundary.rest){

				// start to rest
				perc = (scrollLeft - boundary.rest)/(boundary.start - boundary.rest);
				direction = 1;
				baseBoundary = boundary;

			}else if(scrollLeft>boundary.rest && scrollLeft<boundary.end){

				// rest to end
				perc = (scrollLeft - boundary.rest)/(boundary.end - boundary.rest);
				direction = -1;
				baseBoundary = boundary;

			}else if(Math.abs(scrollLeft-boundary.rest) < 50){

				// rest
				perc = 0;
				direction = 0;
				baseBoundary = boundary;
			}
		});
			
		if(baseBoundary){
			this.scaleHorizonsTo(perc,baseBoundary,direction,margin);
			this.margin = margin;
		}
	};

	HorizonController.prototype.bind = function(){
		var self = this;

		this.$track.scroll(function(){
			self.resizeAll();
		});
	};

	return HorizonController;
});