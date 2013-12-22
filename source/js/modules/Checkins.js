define(['jquery', 'underscore', 'backbone', 'app', 'leaflet'],
function ($, _, Backbone, app, L) {
	var Models = {};
	var Collections = {};
	var Views = {};

	Models.Checkin = Backbone.Model.extend({
		url: function () {
			return app.api('global');
		},
		parse: function (response) {
			return response;
		}
	});

	Collections.Checkins = Backbone.Collection.extend({
		model: Models.Checkin,
		url: function () {
			return app.api('checkins');
		},
		parse: function (response) {
			return response;
		},
		initialize: function (models, options) {
			this.options = options || {};
		}
	});

	Collections.All = Collections.Checkins.extend({
		url: function () {
			return app.api('checkins', null, {
				all: true
			});
		}
	});

	Collections.Since = Collections.Checkins.extend({
		url: function () {
			return app.api('checkins', null, {
				since: this.options.since
			});
		}
	});

	Views.Map = Backbone.View.extend({
		template: 'checkins/map',
		initialize: function (options) {
			this.options = options;
			this.listenTo(this.collection, 'sync', this.updateVenues);
		},
		map: null,
		venues: null,
		serialize: function () {
			return this.collection.toJSON();
		},
		beforeRender: function () {
		},
		afterRender: function () {
			var that = this;
			var tileserver = '//{s}.tiles.mapbox.com/v3/redmart.map-272voadg/{z}/{x}/{y}.png';
			var map = this.map = new L.Map(this.el);
			map.setView([1.35, 103.8], 11);
			L.tileLayer(tileserver, {
				attribution: '&copy; CloudMade, OpenStreetMap',
			}).addTo(map);
			map.on('drag', function () {
				map.stopLocate();
			});
			// map.on('move', _.throttle(function () {
			// 	var location = map.getCenter();
			// 	that.model
			// 		.set(location)
			// 		.fetch();
			// 	that.collection
			// 		.setLocation(location)
			// 		.fetch();
			// }, 1000));
			// this.locateMe();
		},
		cleanup: function () {
			this.map.stopLocate();
		},
		locateMe: function (event) {
			this.map.stopLocate();
			this.map.locate({
				enableHighAccuracy: true,
				setView: true,
				watch: true
			});
		},
		updateVenues: function () {
			var venues = {
				type: 'FeatureCollection',
				features: this.collection.map(function (checkin) {
					var venue = checkin.get('route')[0];
					var point = {
						type: 'Point',
						coordinates: venue.location.coordinates
					};
					var feature = {
						type: 'Feature',
						id: checkin.id,
						geometry: point,
						properties: {
							name: venue.address,
							popupContent: checkin.start_time
						}
					};
					return feature;
				})
			};
			if (this.venues) {
				this.map.removeLayer(this.venues);
			}
			this.venues = L.geoJson(venues).addTo(this.map);
		}
	});

	return {
		Models: Models,
		Collections: Collections,
		Views: Views
	};
});
