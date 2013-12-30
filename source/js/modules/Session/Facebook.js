define(['underscore', 'facebook', 'modules/Session/Base'],
function (_, FB, Session) {
	return Session.extend({
		signIn: function (options) {
			options = options || {};
			var that = this;
			var scope = options.scope || this.options.scope || [];
			var onSuccess = function (authResponse) {
				that.save(authResponse, {
					error: options.error,
					success: function () {
						that.trigger('signIn');
						if (_.isFunction(options.success)) {
							options.success();
						}
					}
				});
			};
			FB.login(function (response) {
				if (response.authResponse) {
					onSuccess(response.authResponse);
				} else {
					if (_.isFunction(options.error)) { options.error(); }
				}
			}, {
				scope: scope
			});
		},
		getAuthStatus: function (options) {
			options = options || {};
			FB.getLoginStatus(_.bind(function (response) {
				if (response.status === 'connected') {
					this.save(response.authResponse);
					if (_.isFunction(options.success)) { options.success(); }
				} else {
					this.destroy();
					this.clear();
					if (_.isFunction(options.error)) { options.error(); }
				}
			}, this));
		},
		hasPermission: function (options) {
			var scopes = _.isString(options.scope) ?
				options.scope.split(/\s*,\s*/) :
				options.scope;
			var checkPermissions = function (granted, scopes) {
				return _.every(scopes, function (scope) {
					return _.some(granted, function (permissions) {
						return !!permissions[scope];
					});
				});
			};
			this.getAuthStatus({
				success: function () {
					FB.api('/me/permissions', 'GET', function (response) {
						if (response && !response.error && response.data) {
							if (checkPermissions(response.data, scopes)) {
								options.success();
							} else {
								options.error();
							}
						}
					});
				},
				error: options.error
			});
		}
	});
});
