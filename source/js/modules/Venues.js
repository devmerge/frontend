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
			return this.model.toJSON();
		},
		beforeRender: function () {
			this.setViews({
				'header': new Views.Cover({
					model: this.model
				})
			});
		},
		afterRender: function () {
		}
	});

	Views.Cover = Backbone.View.extend({
		template: 'venues/cover',
		serialize: function () {
			return this.model.toJSON();
		},
		afterRender: function () {
			var that = this;
			$.get('https://graph.facebook.com/' + this.model.id + '?fields=cover')
			.done(function (data) {
				if (data && data.cover && data.cover.source) {
					that.el.style.backgroundImage = 'url("' + data.cover.source + '")';
				}
			});
		}
	});

	return {
		Models: Models,
		Collections: Collections,
		Views: Views
	};
});
