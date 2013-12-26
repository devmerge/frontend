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
				var menu = new Venues.Views.Details({
					model: new Venues.Models.Details(feature)
				});
				app.layout.panel(menu);
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
