require(['lib/dependencyLoader',
		'ResizeHandler',
		'TransitionHandler',
		'Navigation'],

function(dependencyLoader,
		ResizeHandler,
		TransitionHandler,
		Navigation){
	'use strict';

	dependencyLoader(function(){

		$(document).ready(function(){

			var baseDims = [940,768];

			/* transition handler */
			var transitioner = new TransitionHandler({
					$phases: $('.phase'),
					$track: $('.track')
				}),
				resizer = new ResizeHandler({
					baseDims: baseDims,
					$headerlogo: $('.headerlogo'),
					$backgrounds: $('.scaledbackground'),
					$phraseWrappers: $('.phase-wrapper'),
					$phraseScaleables: $('.scaleable')
				}),
				navhandler = new Navigation({
					$track: $('.track'),
					$trackinner: $('.trackinner'),
					$navlinks: $('.timeline-phase a')
				});

			transitioner.bind();
			resizer.bind();
			navhandler.bind();

			resizer.trigger();

		});
	});
});