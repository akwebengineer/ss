/*
 * GET home page.
 */

var index = function(app) {
	var fs, configurationFile;
	var buildInfo = {};
	var config = {};
        var svgSpriteFile = app.get('docroot') + '/assets/images/icon-inline-sprite.svg';

	fs = require('fs');

    if (process.env.NODE_ENV == 'production') {
	    buildInfoFile = app.get("docroot") + '/assets/js/build-info.json';

	    try {
	    	if (fs.statSync(buildInfoFile).isFile()) {
		        buildInfo = JSON.parse(
				    fs.readFileSync(buildInfoFile)
				);
			}
	    }
	    catch (err) {
	    	console.log("Failed to read build info from", buildInfoFile);
        }
    }

    try {
    	var configFile = app.get("docroot") + '/assets/js/conf/global_config.js';
		config = require(configFile);
    }
    catch (err) {
    	console.log("Config file", configFile, "not found.  Skipping.");
    }

    var locals = buildInfo;

    try {
        var sprite = fs.readFileSync(svgSpriteFile);
        locals.svg_sprite = sprite;
    }
    catch(err) {
        console.log("Can't read svg sprite from", svgSpriteFile);
    }

    locals.theme = config.theme || "";
	// Catch all route to land unavailable resource requests. This should be the last one declared in
	// order to avoid resolving any available resources by this route config.


	// Catch failed requests for static resources and respond with 404
	app.get(['/installed_plugins/*', '/assets/*'], function (req, res, next) {
		res.status(404).send();
	});

	// Catch all route that enables bookmarking by returning index.html
	app.get('*', function (req, res) {
			res.header("Cache-Control", "nocache");
			return res.render('index', locals);
	});
};

module.exports = index;
