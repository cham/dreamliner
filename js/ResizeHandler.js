/*
 * window resize handler
 */
define(function(){
	'use strict';

	function shittyDims(DOMelement) {
	    var img = new Image();
	    img.src = DOMelement.src;
	    return {width: img.width, height: img.height};
	}

	function ResizeHandler(opts){//baseDims,$headerlogo, $backgrounds, $phraseWrappers, $phraseScaleables){
		this.baseDims = opts.baseDims;
		this.$headerlogo = opts.$headerlogo;
		this.$backgrounds = opts.$backgrounds;
		this.$phraseWrappers = opts.$phraseWrappers;
		this.$phraseScaleables = opts.$phraseScaleables;
		this.$window = opts.$window;
		this.$doc = opts.$document;
		this.$clip = opts.$clip;
	}

	ResizeHandler.prototype.scaleBackgroundImages = function(toHeight,fillWidth){
		// scaledbackground always matches window height
		this.$backgrounds.each(function(){
			var $this = $(this),
				naturalHeight = this.naturalHeight || shittyDims(this).height,
				naturalWidth = this.naturalWidth || shittyDims(this).width,
				thisRatio = toHeight / naturalHeight,
				toWidth = Math.floor(naturalWidth*thisRatio),
				totalWidth = toWidth,
				$clone;

			$this.height(toHeight).width(toWidth);

			if(!$this.hasClass('autotile')){return;}

			$this.parent().find('.clonebackground').remove();

			while(totalWidth<fillWidth){
				$clone = $this.clone();
				$clone.removeClass('scaledbackground').addClass('clonebackground');
				$clone.css({position:'absolute',left:totalWidth});
				$this.after($clone);
				totalWidth+=toWidth;
			}

		});
	};

	ResizeHandler.prototype.scaleHeaderLogo = function(scaleFactor){
		var self = this;

		this.$headerlogo.each(function(){
			var $this = $(this),
				restpos = parseInt($this.data('resttop'),10);

			$this.css({
				width: Math.floor(this.naturalWidth * scaleFactor),
				height: Math.floor(this.naturalHeight * scaleFactor),
				top: Math.floor(restpos * scaleFactor)
			}).parent().css({
				width: Math.floor(this.naturalWidth * scaleFactor),
				height: Math.floor(this.naturalHeight * scaleFactor)
			});
		});
	};

	ResizeHandler.prototype.scalePhaseTo = function(scaleFactor,topOffset){
		var self = this;

		this.$phraseWrappers.css({
			width: Math.floor(this.baseDims[0]*scaleFactor),
			height: Math.floor(this.baseDims[1]*scaleFactor),
			marginTop: topOffset
		});

		// scale illustration to factor of baseDim[1] over wh
		this.$phraseScaleables.each(function(){
			var $this = $(this),
				resttop = parseInt($this.data('resttop'),10) || false,
				restbottom = parseInt($this.data('restbottom'),10) || false,
				restleft = parseInt($this.data('restleft'),10) || false,
				restright = parseInt($this.data('restright'),10) || false,
				cssProperties = {
					width: Math.floor(this.naturalWidth * scaleFactor),
					height: Math.floor(this.naturalHeight * scaleFactor)
				};

			if(resttop!==false){ cssProperties.top = Math.floor(resttop * scaleFactor); }
			if(restbottom!==false){ cssProperties.bottom = Math.floor(restbottom * scaleFactor); }
			if(restleft!==false){ cssProperties.left = Math.floor(restleft * scaleFactor); }
			if(restright!==false){ cssProperties.right = Math.floor(restright * scaleFactor); }

			$this.css(cssProperties);
		});
	};

	ResizeHandler.prototype.bind = function(){
		var self = this;

		function handleResize(){
			var ww = self.$window.width(),
				wh = self.$window.height(),
				wRatio = ww/self.baseDims[0],
				hRatio = wh/self.baseDims[1],
				smallestRatio = Math.min(wRatio,hRatio,1),
				phaseTopMargin = Math.floor((wh-(self.baseDims[1]*smallestRatio))/2); // window height minus phase height div 2

			self.scaleBackgroundImages(wh,ww);
			self.scaleHeaderLogo(smallestRatio);
			self.scalePhaseTo(smallestRatio,phaseTopMargin);

			self.$clip.css({width:ww,height:wh});

			if(self.resizeCb){
				self.resizeCb(Math.min(1,smallestRatio),phaseTopMargin);
			}
		}

		this.$window.resize(handleResize);
		if(window.onorientationchange){
			onorientationchange = handleResize;
		}
	};

	ResizeHandler.prototype.onResize = function(cb){
		this.resizeCb = cb;
	};

	ResizeHandler.prototype.trigger = function(){
		this.$window.trigger('resize');
	};

	return ResizeHandler;

});