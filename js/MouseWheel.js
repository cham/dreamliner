define(function(){
	
	function MouseWheel(opts){
		this.$body = opts.$body;
		this.$track = opts.$track;
		this.scrollbarWidth = opts.scrollbarWidth;
	}

	MouseWheel.prototype.bind = function(){
		var self = this,
			$track = this.$track,
			scrollbarWidth = this.scrollbarWidth;

		this.$body.mousewheel(_.throttle(function(e, delta){
			var targetPos,
				currentPos = $track.scrollLeft(),
				scrollDist = 300,
				scrollSpeed = 100;

			delta = 0 - delta; // invert delta
			targetPos = Math.min(Math.max(currentPos + (scrollDist*delta), 0), scrollbarWidth);

			if(targetPos!==currentPos){
				$track.scrollTo(targetPos,scrollSpeed);
			}
		},100));
	};

	return MouseWheel;

});