define(['jquery', 'underscore', 'backbone', 'app'],
function ($, _, Backbone, app) {
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
			'click .facebook': 'login'
		},
		login: function (event) {
			app.session.signIn({
				scope: 'user_checkins, read_stream'
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
