define([
	'jquery', 'underscore', 'backbone', 'app',
	'modules/Users'
],
function (
	$, _, Backbone, app,
	Users
) {
	var Models = {};
	var Collections = {};
	var Views = {};

	Views.Base = Backbone.View.extend({
		initialize: function (options) {
			window.scrollTo(0, 0);
		}
	});

	Views.Landing = Views.Base.extend({
		template: 'layouts/landing',
		events: {
			'click .location': 'location',
			'click .facebook': 'login'
		},
		location: function (event) {
			this.getView('.map').locateMe();
		},
		login: function (event) {
			app.session.signIn({
				scope: 'user_checkins, read_stream',
				success: function () {
					var facebook = new Users.Models.Facebook();
					var credentials = app.session.pick(
						'accessToken', 'expiresIn', 'userID', 'signedRequest'
					);
					facebook.save(credentials, {
						success: function () {
							console.trace('saved!');
						},
						error: function () {
							console.trace('oops?', arguments);
						}
					});
				}
			});
		}
	});

	Views['404'] = Views.Base.extend({
		template: 'layouts/404'
	});

	return {
		Models: Models,
		Collections: Collections,
		Views: Views
	};
});
