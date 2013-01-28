define(function(){

	var LEFT = 37,
		RIGHT = 39;
	
	function KeyboardNav(opts){
		this.$document = opts.$document;
		this.moveCb = function(direction){};
	}

	KeyboardNav.prototype.onMove = function(cb){
		this.moveCb = cb;
	};

	KeyboardNav.prototype.bind = function(){
		var self = this;

		this.$document.keydown(function(e){
			var keyCode = e.keyCode;

			if(!keyCode || !([LEFT,RIGHT].indexOf(keyCode) > -1)){
				return;
			}

			self.moveCb(keyCode===LEFT);
		});
	};

	return KeyboardNav;

});