define([
	'jquery', 'underscore', 'backbone', 'app',
	'modules/Menus',
	'modules/Users'
],
function (
	$, _, Backbone, app,
	Menus,
	Users
) {
	var Models = {};
	var Collections = {};
	var Views = {};

	Views.Facebook = Backbone.View.extend({
		template: 'settings/facebook',
		events: {
			'click .login': 'login'
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

	Views.Menu = Menus.Views.Panel.extend({
		beforeRender: function () {
			this.setViews({
				'.content': new Views.Facebook({
				})
			});
		}
	});

	return {
		Models: Models,
		Collections: Collections,
		Views: Views
	};
});
