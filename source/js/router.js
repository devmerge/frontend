define([
	'jquery', 'underscore', 'backbone', 'app',
	'modules/Checkins',
	'modules/Layouts'
], function (
	$, _, Backbone, app,
	Checkins,
	Layouts
) {
	return Backbone.Router.extend({

		routes: {
			'': 'landing',
			'*path': '404'
		},

		landing: function () {
			var checkins = new Checkins.Collections.Global([], {});
			app.useLayout(Layouts.Views.Landing, {
			}).setViews({
				'.map': new Checkins.Views.Map({
					collection: checkins
				})
			}).render();
		},

		404: function () {
			app.useLayout(Layouts.Views['404'], {
			}).render();
		}

	});
});
