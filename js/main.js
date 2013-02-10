require(['lib/dependencyLoader',
		'ResizeHandler',
		'TransitionHandler',
		'Navigation',
		'PositionCalculator',
		'HorizonController',
		'FactManager',
		'MouseWheel',
		'KeyboardNav'],

function(dependencyLoader,
		ResizeHandler,
		TransitionHandler,
		Navigation,
		PositionCalculator,
		HorizonController,
		FactManager,
		MouseWheel,
		KeyboardNav){
	'use strict';

	function infographic(){

		var baseDims = [940,768],
			scrollbarWidth = 200000,
			$window = $(window),
			$document = $(document),
			$body = $('body');

		/* transition handler */
		var posCalc = new PositionCalculator({
				$body: $body,
				$window: $window,
				$document: $document,
				scrollbarWidth: scrollbarWidth
			}),
			transitioner = new TransitionHandler({
				baseDims: baseDims,
				$phases: $('.phase'),
				$track: posCalc.getEl(),
				$phraseWrappers: $('.phase-wrapper')
			}),
			resizer = new ResizeHandler({
				baseDims: baseDims,
				$headerlogo: $('.headerlogo'),
				$backgrounds: $('.scaledbackground'),
				$phraseWrappers: $('.phase-wrapper'),
				$phraseScaleables: $('.scaleable'),
				$window: $window,
				$document: $document,
				$clip: $('.hardclip')
			}),
			navhandler = new Navigation({
				$track: posCalc.getEl(),
				$trackinner: posCalc.getInnerEl(),
				$navlinks: $('.timeline-phase a')
			}),
			horizon = new HorizonController({
				$track: posCalc.getEl(),
				$horizons: $('.horizon')
			}),
			factMgr = new FactManager({
				$track: posCalc.getEl(),
				$facts: $('.phase-facts'),
				$triggers: $('.factline'),
				$popups: $('.popup-fact'),
				$popupframe: $('.facts'),
				$closers: $('.fact-close,.factbg'),
				$window: $window
			}),
			mouseWheel = new MouseWheel({
				$body: $body,
				$track: posCalc.getEl(),
				scrollbarWidth: scrollbarWidth
			}),
			kbNav = new KeyboardNav({
				$document: $document
			});

		resizer.onResize(function(scale,topmargin){
			var newBoundaries;

			posCalc.recalculate();
			newBoundaries = posCalc.getBoundaries();

			transitioner.setScale(scale);
			horizon.setScale(scale);
			factMgr.setScale(scale);

			transitioner.updatePhraseBoundaries(newBoundaries);
			navhandler.updateNavPositions(newBoundaries);
			horizon.updatePositions(newBoundaries);
			factMgr.updatePositions(newBoundaries);
			factMgr.toggleFacts();
			factMgr.centerAllPopups();
			factMgr.positionAllFacts();

			horizon.resizeAll(topmargin);
		});

		kbNav.onMove(function(direction){
			if(direction){
				navhandler.moveLeft();
			}else{
				navhandler.moveRight();
			}
		});

		transitioner.bind();
		resizer.bind();
		navhandler.bind();
		horizon.bind();
		factMgr.bind();
		mouseWheel.bind();
		kbNav.bind();

		navhandler.updateIndex();
		
		resizer.trigger();

		// logo fake click
		$('.thomsonlogo').click(function(e){
			e.preventDefault();
			e.stopPropagation();

			window.open('http://holidaysjustgotbetter.thomson.co.uk/flights/');
		});
	}

	// require dependencies and run
	dependencyLoader(function(){

		if(window.preloaded){ // IE7/8 bug, window loads before main.js executes
			infographic();
		}else{
			$(window).load(infographic); // everything else
		}

	});
});