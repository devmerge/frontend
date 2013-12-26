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

	Views.Menu = Menus.Views.Panel.extend({
		beforeRender: function () {
			this.setViews({
				'.content': new Views.Time({
				})
			});
		}
	});

	Views.Time = Backbone.View.extend({
		template: 'filters/time'
	});

	return {
		Models: Models,
		Collections: Collections,
		Views: Views
	};
});
