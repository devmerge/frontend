define(['jquery', 'underscore', 'backbone', 'app'],
function ($, _, Backbone, app) {
	var Models = {};
	var Collections = {};
	var Views = {};

	Models.Facebook = Backbone.Model.extend({
		url: function () {
			return app.api('users');
		},
		parse: function (response) {
			console.trace('parssssing');
			return {};
		}
	});

	return {
		Models: Models,
		Collections: Collections,
		Views: Views
	};
});
