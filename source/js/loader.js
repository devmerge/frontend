/*jslint maxlen: 240 */
require.config({
	baseUrl: '/js',
	deps: ['main'],
	paths: {
		backbone: '//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.0.0/backbone-min',
		facebook: '//connect.facebook.net/en_US/all',
		handlebars: '//cdnjs.cloudflare.com/ajax/libs/handlebars.js/1.0.0-rc.4/handlebars.min',
		jquery: '//cdnjs.cloudflare.com/ajax/libs/jquery/1.9.1/jquery.min',
		'backbone.layoutmanager': '//cdnjs.cloudflare.com/ajax/libs/backbone.layoutmanager/0.8.8/backbone.layoutmanager.min',
		underscore: '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.4/underscore-min',
		leaflet: '//cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.1/leaflet',
		fastclick: '//cdnjs.cloudflare.com/ajax/libs/fastclick/0.6.7/fastclick.min'
	},
	shim: {
		backbone: {
			deps: ['underscore', 'jquery'],
			exports: 'Backbone'
		},
		facebook: {
			exports: 'FB'
		},
		handlebars: {
			exports: 'Handlebars'
		},
		jquery: {
			exports: 'jQuery'
		},
		'backbone.layoutmanager': {
			deps: ['backbone']
		},
		underscore: {
			exports: '_'
		},
		leaflet: {
			exports: 'L'
		},
		fastclick: {
			deps: ['jquery'],
			exports: 'FastClick'
		},
	}
});
