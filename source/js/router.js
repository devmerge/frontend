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
				var details;
				if (app.layout.getView('.details')) {
					details = app.layout.getView('.details');
					details.model = new Venues.Models.Details(feature);
					details.render();
				} else {
					details = new Venues.Views.Details({
						model: new Venues.Models.Details(feature),
						map: map
					});
					$(map.el).addClass('mute');
					details.on('cleanup', function (event) {
						$(map.el).removeClass('mute');
					});
					app.layout.setViews({
						'.details': details
					});
					details.render();
				}
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
