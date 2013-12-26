module.exports = function (grunt) {
	return {
		development: {
			options: {
				hostname: '192.168.0.34',
				base: '<%= source %>',
				port: 9000
			}
		},
		staging: {
			options: {
				base: '<%= staging %>',
				port: 9001
			}
		},
		production: {
			options: {
				base: '<%= production %>',
				port: 9002
			}
		},
		options: {
			middleware: function (connect, options) {
				return [
					connect.static(options.base),
					function (req, res) {
						var path = options.base + '/index.html';
						var file = grunt.file.read(path);
						res.end(file);
					}
				];
			}
		}
	};
};
