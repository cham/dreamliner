require(['lib/dependencyLoader',
		'ResizeHandler',
		'TransitionHandler',
		'Navigation',
		'PositionCalculator',
		'HorizonController',
		'FactManager'],

function(dependencyLoader,
		ResizeHandler,
		TransitionHandler,
		Navigation,
		PositionCalculator,
		HorizonController,
		FactManager){
	'use strict';

	dependencyLoader(function(){

		$(window).load(function(){

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
					$window: $window,
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

				horizon.resizeAll(topmargin);
			});

			transitioner.bind();
			resizer.bind();
			navhandler.bind();
			horizon.bind();
			factMgr.bind();

			$body.mousewheel(_.throttle(function(e, delta){
				var targetPos,
					$el = posCalc.getEl(),
					currentPos = $el.scrollLeft(),
					scrollDist = 300,
					scrollSpeed = 100;

				delta = 0 - delta; // invert delta
				targetPos = Math.min(Math.max(currentPos + (scrollDist*delta), 0), scrollbarWidth);

				if(targetPos!==currentPos){
					$el.scrollTo(targetPos,scrollSpeed);
				}
			},100));

			resizer.trigger();

		});
	});
});