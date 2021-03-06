define([
	'jquery', 'underscore', 'backbone', 'app'
],
function (
	$, _, Backbone, app
) {
	var Models = {};
	var Collections = {};
	var Views = {};

	Views.Base = Backbone.View.extend({
		initialize: function (options) {
			window.scrollTo(0, 0);
		}
	});

	Views.Landing = Views.Base.extend({
		template: 'layouts/landing',
		panel: function (menu) {
			var map = this.getView('.map');
			$(map.el).addClass('mute');
			menu.on('cleanup', function (event) {
				$(map.el).removeClass('mute');
			});
			this.setViews({
				'.panel': menu
			});
			menu.render();
		}
	});

	Views['404'] = Views.Base.extend({
		template: 'layouts/404'
	});

	return {
		Models: Models,
		Collections: Collections,
		Views: Views
	};
});
