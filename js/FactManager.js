define(function(){
	
	function FactManager(opts){
		this.$track = opts.$track;
		this.$facts = opts.$facts;
		this.$triggers = opts.$triggers;
		this.$popups = opts.$popups;
		this.$popupframe = opts.$popupframe;
		this.$closers = opts.$closers;
		this.$window = opts.$window;

		this.$currentFact = undefined;
		this.boundaries = [];
		this.scale = 1;
	}

	FactManager.prototype.updatePositions = function(boundaries){
		this.boundaries = boundaries;
	};

	FactManager.prototype.setScale = function(s){
		this.scale = s;
	};

	FactManager.prototype.toggleFacts = function(){
		var self = this,
			scrollLeft = this.$track.scrollLeft(),
			boundaryDiff;

		if(scrollLeft > _(this.boundaries).max()){
			self.showFacts(this.boundaries[this.boundaries.length-1]);
			return;
		}

		_(this.boundaries).each(function(b,i){
			boundaryDiff = b-scrollLeft;
			if(boundaryDiff>=0 && boundaryDiff<200){
				self.showFacts(i);
			}else{
				self.hideFacts(i);
			}
		});
	};

	FactManager.prototype.showFacts = function(index){
		var $fact = this.$facts.filter(':eq('+index+')'),
			scale = this.scale;

		$fact.removeClass('hide').addClass('show').find('.factline').each(function(){
			var $this = $(this),
				top = Math.floor(parseInt($this.data('top'),10) * scale),
				left = Math.floor(parseInt($this.data('left'),10) * scale);

			$(this).css({
				top: top,
				left: left
			});
		});
	};

	FactManager.prototype.popupFact = function(fid){
		this.$currentFact = $('#'+fid);

		this.$popups.hide();
		this.$currentFact.add(this.$popupframe).show();

		this.centerPopup();
	};

	FactManager.prototype.centerPopup = function(){
		var ww,wh,fw,fh,top,left;

		if(!this.$currentFact){return;}

		ww = this.$window.width();
		wh = this.$window.height();
		fw = this.$currentFact.outerWidth();
		fh = this.$currentFact.outerHeight();
		top = Math.floor((wh-fh)/2);
		left = Math.floor((ww-fw)/2);

		this.$currentFact.css({
			top: top,
			left: left
		});
	};

	FactManager.prototype.closePopup = function(){
		this.$popupframe.hide();
		this.$currentFact = undefined;
	};

	FactManager.prototype.hideFacts = function(index){
		this.$facts.filter(':eq('+index+')').removeClass('show').addClass('hide');
	};

	FactManager.prototype.bind = function(){
		var self = this;

		this.$track.scroll(function(){
			self.toggleFacts();
		});

		this.$triggers.click(function(e){
			e.preventDefault();
			e.stopPropagation();

			self.popupFact($(this).data('factid'));
		});

		this.$closers.click(function(e){
			e.preventDefault();
			e.stopPropagation();

			self.closePopup();
		});

		this.$window.resize(function(){
			self.centerPopup();
		});
	};

	return FactManager;

});