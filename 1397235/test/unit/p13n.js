var store = require('../../p13n/store/store');
var pluginLoader = require('../../p13n/pluginLoader');
var pluginRouter = require('../../p13n/pluginRouter');
var path = require('path');
var _ = require('lodash');

assert = require('assert');

describe('p13n tests', function() {
	it('test datastore setter/getter', function(done) {
		var urlObject = {
		    "url": "foo/bar",
	        "referrals": 40	
		};

        store.set("test.p13n.key", urlObject, function(err) {
        	if (err) {
	    	    assert("false");
	    	    done();
	    	}
	    });

	    store.get("test.p13n.key", function(err, val) {
	        if (err) {
	        	assert(false);
	        }
	        else {
	        	assert.equal(val.url, urlObject.url);
	        	assert.equal(val.referrals, urlObject.referrals);
	        }
	        done();
	    });
	});

	it('test plugin loader', function() {
        var plugins = pluginLoader.loadPlugins(path.join(__dirname, "./test_data/p13n/plugins"));

        assert.equal(plugins.length, 1);

        var plugin = plugins[0];

        var manifest = {
			"name": "Test plugin",
			"description": "A test plugin",
			"version": "1.0",
			"min_platform_version": "0.0.1",
			"category": "url",
			"features": [
			    {
			    	"name": "referred",
			    	"api": "topn",
			    	"method": "topURLs"
			    }
			],
			"module": "urlAnalyzer"
		};

        assert.equal(plugin.manifest.name, manifest.name);
        assert.equal(plugin.manifest.module, manifest.module);
        assert(_.isFunction(plugin.module));

        var plugin_module = new plugin.module();
        assert(_.isFunction(plugin_module.topURLs));
        assert(_.isFunction(plugin_module.process));
	});

	it('test plugin router', function() {
        var express = require('express');
        var app = express();

        var plugins = pluginLoader.loadPlugins(path.join(__dirname, "./test_data/p13n/plugins"));
        var plugin = plugins[0];

        plugin.moduleInstance = new plugin.module();

        pluginRouter.registerPluginRoutes(plugins[0], app);

        var route;

        app._router.stack.forEach(function(routeElement) {					
            if (routeElement.route && routeElement.route.path == "/url/referred/topn") {
            	route = routeElement;
            }
        });

        assert(route);
	});
})