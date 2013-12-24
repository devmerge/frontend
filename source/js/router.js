define([
	'jquery', 'underscore', 'backbone', 'app',
	'modules/Checkins',
	'modules/Venues',
	'modules/Layouts'
], function (
	$, _, Backbone, app,
	Checkins,
	Venues,
	Layouts
) {
	return Backbone.Router.extend({

		routes: {
			'': 'landing',
			'*path': '404'
		},

		landing: function () {
			var checkins = new Checkins.Collections.All([], {});

			var map = new Checkins.Views.Map({
				collection: checkins
			})
			.on('venue', function (feature) {
				console.log(
					feature.properties.active ?
						'Merge going on today!' :
						'No merging so far today'
				);
				var details = new Venues.Views.Details({
					feature: feature,
					map: map
				});
				app.layout.setViews({
					'.details': details
				});
				details.render();
			});

			app.useLayout(Layouts.Views.Landing, {
			}).setViews({
				'.map': map
			}).render();
		},

		404: function () {
			app.useLayout(Layouts.Views['404'], {
			}).render();
		}

	});
});
