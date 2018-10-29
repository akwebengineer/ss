/*
 * GET framework global configuration
 */

var index = function(app) {
	var fs, configFile;

	var default_config = {
        product_name: "Slipstream",
        product_version: "dev",
        product_release_year: "YYYY"
	};

	app.get('/assets/js/conf/global_config.js', function(req, res) {
        res.header("Cache-Control", "nocache");
		res.header("Content-type", "application/json");

		var module = "define(function() { return " + JSON.stringify(default_config) + ";})";
		return res.send(module);
	});
};

module.exports = index;