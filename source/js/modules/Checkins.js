define([
	'jquery', 'underscore', 'backbone', 'app',
	'leaflet',
	'locatecontrol'
],
function (
	$, _, Backbone, app,
	L,
	locatecontrol
) {
	var Models = {};
	var Collections = {};
	var Views = {};

	var Controls = {};

	Controls.Menu = L.Control.extend({
		options: {
			position: 'topright'
		},
		onAdd: function (map) {
			var container = L.DomUtil.create(
				'div',
				'leaflet-control-menu leaflet-bar'
			);
			new Views.MapMenu({ el: container }).render();
			return container;
		}
	});

	Controls.Filters = L.Control.extend({
		options: {
			position: 'topright'
		},
		onAdd: function (map) {
			var container = L.DomUtil.create(
				'div',
				'leaflet-control-filters leaflet-bar'
			);
			new Views.MapFilters({ el: container }).render();
			return container;
		}
	});

	Models.Checkin = Backbone.Model.extend({
		url: function () {
			return app.api('checkin');
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

	Views.MapLocation = Backbone.View.extend({
		template: 'checkins/location'
	});

	Views.MapFilters = Backbone.View.extend({
		template: 'checkins/filters'
	});

	Views.MapMenu = Backbone.View.extend({
		template: 'checkins/menu'
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
			// Map
			var map = this.map = new L.Map(this.el);
			map.setView([1.35, 103.8], 12);
			L.tileLayer(
				// 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
				'//{s}.tiles.mapbox.com/v3/' +
					'sebdeckers.gk5lcjnp/{z}/{x}/{y}.png',
				{ detectRetina: true }
			).addTo(map);
			// Locate
			var lc = L.control.locate({
				follow: true
			}).addTo(map);
			map.on('startfollowing', function() {
				map.on('dragstart', lc.stopFollowing);
			}).on('stopfollowing', function() {
				map.off('dragstart', lc.stopFollowing);
			});
			new Views.MapLocation({
				el: lc.getContainer().querySelector('a')
			}).render();
			// Buttons
			map.addControl(new Controls.Menu());
			map.addControl(new Controls.Filters());
			// Pins
			this.collection.fetch();
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
			var getPlace = function (checkin) {
				return checkin.get('place').id;
			};
			var hasCoordinates = function (checkin) {
				var place = checkin.get('place');
				return place &&
					place.location &&
					place.location.longitude &&
					place.location.latitude;
			};
			var toFeature = function (checkins) {
				var checkin = _.find(checkins, hasCoordinates);
				if (!checkin) {
					return;
				}
				var place = checkin.get('place');
				var point = {
					type: 'Point',
					coordinates: [
						place.location.longitude,
						place.location.latitude
					]
				};
				var feature = {
					type: 'Feature',
					id: place.id,
					geometry: point,
					properties: {
						name: place.name
					}
				};
				return feature;
			};
			var venues = {
				type: 'FeatureCollection',
				features: this.collection.chain()
					.groupBy(getPlace)
					.map(toFeature)
					.compact()
					.value()
			};
			if (this.venues) {
				this.map.removeLayer(this.venues);
			}
			var FacebookIcon = L.Icon.extend({
				options: {
					// shadowUrl: 'leaf-shadow.png',
					// shadowSize: [50, 64],
					// shadowAnchor: [4, 62],
					iconSize: [50, 50],
					iconAnchor: [25 + 5, 25 + 5],
					popupAnchor: [-3, -76]
				}
			});
			var drawFacebookMarker = function (feature, latlng) {
				var icon = new FacebookIcon({
					iconUrl: 'https://graph.facebook.com/' +
						feature.id +
						'/picture'
				});
				var marker = L.marker(latlng, {
					icon: icon,
					riseOnHover: true,
					title: feature.properties.name
				});
				marker.on('click', function (event) {
					console.log(event);
				});
				return marker;
			};
			this.venues = L.geoJson(venues, {
				pointToLayer: drawFacebookMarker
			}).addTo(this.map);
			this.map.fitBounds(this.venues.getBounds(), {
				padding: [40, 40]
			});
		}
	});

	return {
		Models: Models,
		Collections: Collections,
		Views: Views
	};
});
