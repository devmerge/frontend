define([
	'jquery', 'underscore', 'backbone', 'app',
	'facebook',
	'modules/Checkins',
	'modules/Venues',
	'modules/Layouts',
	'modules/Settings',
	'modules/Users'
], function (
	$, _, Backbone, app,
	Facebook,
	Checkins,
	Venues,
	Layouts,
	Settings,
	Users
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

			app.session.getAuthStatus({
				success: function () {
					var facebook = new Users.Models.Facebook();
					var credentials = app.session.pick(
						'accessToken', 'userID'
					);
					facebook.save(credentials);
				},
				error: function () {
					var menu = new Settings.Views.Menu({
					});
					app.layout.panel(menu);
				}
			});
		},

		404: function () {
			app.useLayout(Layouts.Views['404'], {
			}).render();
		}

	});
});
