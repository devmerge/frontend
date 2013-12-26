define([
	'jquery', 'underscore', 'backbone', 'app',
	'hammer'
],
function (
	$, _, Backbone, app,
	hammer
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
			'click .close': 'close'
		},
		serialize: function () {
			var getParticipants = function (checkin) {
				var from = checkin.from ?
					checkin.from : [];
				var with_tags = checkin.with_tags && checkin.with_tags.data ?
					checkin.with_tags.data : [];
				var participants = [].concat(from, with_tags);

				var timestamp = Date.parse(checkin.created_time);
				var date = new Date(timestamp);
				var localeDate = date.toLocaleDateString();
				var localeTime = date.toLocaleTimeString(
					undefined, {
						hour: '2-digit',
						minute: '2-digit'
					}
				);
				return _.map(participants, function (participant) {
					return _.extend(participant, {
						timestamp: timestamp,
						localeTime: localeTime,
						localeDate: localeDate
					});
				});
			};
			var byName = function (participant) {
				return participant.id;
			};
			var byDay = function (participants, localeDate) {
				return {
					localeDate: localeDate,
					participants: _.chain(participants)
						.unique(byName)
						.sortBy('timestamp')
						.reverse()
						.value()
				};
			};
			var byDate = function (day) {
				return day.participants[0].timestamp;
			};
			var days = _.chain(this.model.get('properties').checkins)
				.map(getParticipants)
				.flatten()
				.groupBy('localeDate')
				.map(byDay)
				.sortBy(byDate)
				.reverse()
				.value();
			var context = {
				days: days,
				venue: {
					id: this.model.id,
					name: this.model.get('properties').name,
					active: this.model.get('properties').active
				}
			};
			return context;
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
			var that = this;
			if (!this.appeared) {
				this.appeared = true;
				var effect = 'reveal';
				$(this.el)
					.addClass(effect)
					.one('webkitAnimationEnd mozAnimationEnd' +
						'oAnimationEnd animationEnd', function () {
						$(this).removeClass(effect);
					});
				var setOffset = function (x, y) {
					that.$el.css({
						transform:
							'translateX(' + x + 'px) ' +
							'translateY(' + y + 'px)'
					});
				};
				hammer(this.el)
				.on('dragstart', function (event) {
					that.$el.addClass('dragging');
				})
				.on('release', function (event) {
					if (Math.abs(event.gesture.deltaX) > 100) {
						that.close();
					} else {
						that.$el.removeClass('dragging');
						setOffset(0, 0);
					}
				})
				.on('dragright', function (event) {
					var top = that.$el.find('.venue').scrollTop();
					setOffset(event.gesture.deltaX, top);
				});
			}
		},
		close: function () {
			this.trigger('cleanup');
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
