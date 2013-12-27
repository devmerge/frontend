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
		serialize: function () {
			return {
				authenticated:
					app.session.has('accessToken') &&
					app.session.has('userID')
			};
		},
		login: function (event) {
			var that = this;
			app.session.signIn({
				scope: 'user_checkins, read_stream',
				success: function () {
					var facebook = new Users.Models.Facebook();
					var credentials = app.session.pick(
						'accessToken', 'userID'
					);
					facebook.save(credentials, {
						success: function () {
							that.render();
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
