define(['jquery', 'underscore', 'backbone', 'app'],
function ($, _, Backbone, app) {
	var Models = {};
	var Collections = {};
	var Views = {};

	Models.Details = Backbone.Model.extend({
	});

	Models.Cover = Backbone.Model.extend({
		url: function () {
			return 'https://graph.facebook.com/' + this.id + '?fields=cover';
		}
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
		cover: null,
		initialize: function (options) {
			this.options = options;
			this.cover = new Models.Cover({id: this.model.id});
			this.listenTo(this.model, 'change', this.render);
			this.listenTo(this.cover, 'change', this.render);
			this.cover.fetch();
		},
		serialize: function () {
			return _.extend(
				this.model.toJSON(),
				this.cover.toJSON()
			);
		}
	});

	return {
		Models: Models,
		Collections: Collections,
		Views: Views
	};
});
