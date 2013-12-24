define(['jquery', 'underscore', 'backbone', 'app'],
function ($, _, Backbone, app) {
	var Models = {};
	var Collections = {};
	var Views = {};

	Views.Details = Backbone.View.extend({
		template: 'venues/details',
		initialize: function (options) {
			this.options = options;
		},
		cleanup: function () {
		},
		events: {
		},
		serialize: function () {
		},
		beforeRender: function () {
		},
		afterRender: function () {
			this.el.classList.add('loading');
		}
	});

	return {
		Models: Models,
		Collections: Collections,
		Views: Views
	};
});
