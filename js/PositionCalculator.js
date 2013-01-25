define(function(){
	'use strict';
	
	function PositionCalculator(opts){
		this.$window = opts.$window;
		this.$document = opts.$document;

		this.$el = $('<div class="track"><div class="trackinner"></div></div>');
		this.$calcEl = $('<div class="track-calc" style="position:absolute;top:-100px"><div class="trackinner-calc"></div></div>');

		this.$inner = this.$el.find('.trackinner');
		this.$calcInner = this.$calcEl.find('.trackinner');
	
		opts.$body.append(this.$el);
		opts.$body.append(this.$calcEl);

		this.absoluteMaximum = opts.scrollbarWidth;
		this.maxRight = this.absoluteMaximum;
		this.numPhases = 7;

		this.boundaries = [];
		this.stepSize = 0;
	}

	PositionCalculator.prototype.getEl = function(){
		return this.$el;
	};

	PositionCalculator.prototype.getInnerEl = function(){
		return this.$inner;
	};

	PositionCalculator.prototype.recalculate = function(){
		var self = this;

		this.$calcEl.get(0).scrollLeft = this.absoluteMaximum;
		this.maxRight = this.$calcEl.scrollLeft();

		this.stepSize = Math.floor(this.maxRight / this.numPhases);

		this.boundaries = [];
		_(this.numPhases+1).times(function(i){
			self.boundaries.push(i*self.stepSize);
		});
	};

	PositionCalculator.prototype.getBoundaries = function(){
		return this.boundaries;
	};

	return PositionCalculator;

});