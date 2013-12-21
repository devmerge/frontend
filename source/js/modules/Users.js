define(['jquery', 'underscore', 'backbone', 'app'],
function ($, _, Backbone, app) {
	var Models = {};
	var Collections = {};
	var Views = {};

	Models.Facebook = Backbone.Model.extend({
		url: function () {
			return app.api('users');
		}
	});

	return {
		Models: Models,
		Collections: Collections,
		Views: Views
	};
});
