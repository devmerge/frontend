define([
	'jquery', 'underscore', 'backbone', 'app',
	'modules/Menus'
],
function (
	$, _, Backbone, app,
	Menus
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

	Views.Details = Menus.Views.Panel.extend({
		beforeRender: function () {
			this.setViews({
				'header': new Views.Cover({
					model: new Models.Cover(_.extend(
						this.model.pick('id'),
						this.model.get('properties').checkins[0].place
					))
				}),
				'.content': new Views.Participants({
					model: this.model
				})
			});
		}
	});

	Views.Participants = Backbone.View.extend({
		template: 'venues/participants',
		initialize: function (options) {
			this.options = options;
			this.listenTo(this.model, 'change', this.render);
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
			var properties = this.model.has('properties') ?
				this.model.get('properties') : {};
			var days = _.chain(properties.checkins)
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
					name: properties.name,
					active: properties.active
				}
			};
			return context;
		}
	});

	Views.Cover = Backbone.View.extend({
		template: 'venues/cover',
		initialize: function (options) {
			this.options = options;
			this.listenTo(this.model, 'change', this.render);
			this.model.fetch();
		},
		serialize: function () {
			var directions = _.chain(this.model.get('location'))
				.pick('street', 'city', 'country', 'zip')
				.compact()
				.join(', ')
				.value();
			return _.extend(this.model.toJSON(), {
				directions: {
					label: directions,
					query: encodeURIComponent(directions)
						.replace(/%20/g, '+')
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
