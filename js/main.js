require(['lib/dependencyLoader',
		'ResizeHandler',
		'TransitionHandler',
		'Navigation',
		'PositionCalculator'],

function(dependencyLoader,
		ResizeHandler,
		TransitionHandler,
		Navigation,
		PositionCalculator){
	'use strict';

	dependencyLoader(function(){

		$(document).ready(function(){

			var baseDims = [940,768],
				$window = $(window),
				$document = $(document),
				$body = $('body');

			/* transition handler */
			var posCalc = new PositionCalculator({
					$body: $body,
					$window: $window,
					$document: $document
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
				});

			resizer.onResize(function(scale){
				transitioner.setScale(scale);
				posCalc.recalculate();
				transitioner.updatePhraseBoundaries(posCalc.getBoundaries());
				navhandler.updateNavPositions(posCalc.getBoundaries());
			});

			transitioner.bind();
			resizer.bind();
			navhandler.bind();

			resizer.trigger();

			$body.mousewheel(_.throttle(function(e, delta){
				var targetPos,
					$el = posCalc.getEl()

				delta = 0 - delta;
				targetPos = $el.scrollLeft() + (300*delta);

				$el.scrollTo(Math.max(targetPos,0),100);
			},100));

			document.body.scrollTop = 100;
		});
	});
});