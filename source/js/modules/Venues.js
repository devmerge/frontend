define(['jquery', 'underscore', 'backbone', 'app'],
function ($, _, Backbone, app) {
	var Models = {};
	var Collections = {};
	var Views = {};

	Models.Details = Backbone.Model.extend({
	});

	Views.Details = Backbone.View.extend({
		template: 'venues/details',
		initialize: function (options) {
			this.options = options;
		},
		cleanup: function () {
		},
		events: {
			'click .progress': function (event) {
				this.remove();
			}
		},
		serialize: function () {
			console.log(this.model.toJSON());
			return this.model.toJSON();
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
