define([
	'jquery', 'underscore', 'backbone', 'app',
	'hammer'
],
function (
	$, _, Backbone, app,
	Hammer
) {
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
		appeared: false,
		afterRender: function () {
			if (!this.appeared) {
				this.appeared = true;
				var effect = 'reveal';
				$(this.el)
					.addClass(effect)
					.one('webkitAnimationEnd mozAnimationEnd' +
						'oAnimationEnd animationEnd', function () {
						$(this).removeClass(effect);
					});
				Hammer(this.el).on('swiperight', this.close);
			}
		},
		close: function () {
			app.layout.removeView('.details');
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
