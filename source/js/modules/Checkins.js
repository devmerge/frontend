define(['jquery', 'underscore', 'backbone', 'app'],
function ($, _, Backbone, app) {
	var Models = {};
	var Collections = {};
	var Views = {};

	Models.Global = Backbone.Model.extend({
		url: function () {
			return app.api('global');
		},
		parse: function (response) {
			return response;
		}
	});

	Collections.Global = Backbone.Collection.extend({
		model: Models.Global,
		url: function () {
			return app.api('global');
		},
		parse: function (response) {
			return response;
		}
	});

	Views.Map = Backbone.View.extend({
		template: 'checkins/map',
		initialize: function (options) {
			this.options = options;
		},
		cleanup: function () {
		},
		events: {
		},
		serialize: function () {
			return this.collection.toJSON();
		},
		beforeRender: function () {
		},
		afterRender: function () {
		}
	});

	return {
		Models: Models,
		Collections: Collections,
		Views: Views
	};
});
