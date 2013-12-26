define([
	'jquery', 'underscore', 'backbone', 'app',
	'hammer',
	'modules/Users'
],
function (
	$, _, Backbone, app,
	hammer,
	Users
) {
	var Models = {};
	var Collections = {};
	var Views = {};

	Views.Panel = Backbone.View.extend({
		template: 'menus/panel',
		initialize: function (options) {
			this.options = options;
		},
		cleanup: function () {
		},
		events: {
			'click .close': 'close'
		},
		afterRender: function () {
			var that = this;
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
				var top = that.$el.find('article').scrollTop();
				setOffset(event.gesture.deltaX, top);
			});
		},
		close: function () {
			this.trigger('cleanup');
			app.layout.removeView('.panel');
		}
	});

	Views.Settings = Views.Panel.extend({
		beforeRender: function () {
			this.setViews({
				'.content': new Views.Facebook({
				})
			});
		}
	});

	Views.Facebook = Backbone.View.extend({
		template: 'menus/facebook',
		events: {
			'click .login': 'login'
		},
		login: function (event) {
			app.session.signIn({
				scope: 'user_checkins, read_stream',
				success: function () {
					var facebook = new Users.Models.Facebook();
					var credentials = app.session.pick(
						'accessToken', 'expiresIn', 'userID', 'signedRequest'
					);
					facebook.save(credentials, {
						success: function () {
							console.trace('saved!');
						},
						error: function () {
							console.trace('oops?', arguments);
						}
					});
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
