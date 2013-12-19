define(['jquery', 'underscore', 'backbone', 'app', 'leaflet'],
function ($, _, Backbone, app, L) {
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
			var map = new L.Map(this.el);
			map.setView([1.35, 103.8], 11);
			// map.setMaxBounds(new L.LatLngBounds(
			// 	new L.LatLng(1.22, 103.6),
			// 	new L.LatLng(1.49, 104.05)
			// ));
			L.tileLayer(
				'//{s}.tiles.mapbox.com/v3/redmart.map-272voadg/{z}/{x}/{y}.png'
			).addTo(map);
		}
	});

	return {
		Models: Models,
		Collections: Collections,
		Views: Views
	};
});
