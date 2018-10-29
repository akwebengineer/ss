/**
 * The main personalization module.  This module is responsible for discovering/loading
 * analytics plugins and providing an HTTP interface to the analytics data provided by the plugins.
 * In addition it will run a processing loop that will given the analytics plugins an opportunity to
 * re-compute their analytics data and update the analytics data store.
 * 
 * @module 
 * @name analytics/p13nDaemon.js
 *
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 * 
 */
var path = require('path');
var _ = require('lodash');
var http = require('http');
var program = require('commander');
var httpRequestHandler = require('./server/app');
var pluginLoader = require('./pluginLoader');
var pluginRouter = require('./pluginRouter');
var dataStore = require('./store/store');
var conf = require('./conf/config');
var version = "1.0";
var plugins = [];

/**
 * Perform initialization
 */
function init() {
    commandLineArgs = parseCommandLineArgs();

    // load and initialize plugins
    plugins = pluginLoader.loadPlugins(path.join(__dirname, "plugins"));

    plugins.forEach(function(plugin) {
        try {
            if (_.isFunction(plugin.module)) {
                pluginModuleInstance = new (plugin.module)({
                    "store": dataStore
                });
                plugin.moduleInstance = pluginModuleInstance;
            }
            else {
                throw new Error("Plugin module is not a constructor");
            }

            // register plugin routes with the HTTP request handler
            pluginRouter.registerPluginRoutes(plugin, httpRequestHandler);
        }
        catch(e) {
            console.log("Error initializing plugin '" + plugin.manifest.name + "': ", e);
        }   
    });
}

/**
 * Start the HTTP server that will provide an HTTP interface for 
 * obtaining analytics data.
 */
function startHttpServer() {
    var server = http.createServer(httpRequestHandler);
    var port = program.port || httpRequestHandler.get('port');

    server.listen(port, function() {
        console.log('\nPersonalization server listening on port ' + port);
    });
}

/**
 * Invoke each plugin's data processor so that it can refresh it's analytics
 * data.
 */
function invokeDataProcessors() {
    plugins.forEach(function(plugin) {
        try {
            plugin.moduleInstance.process();
        }
        catch(e) {
            console.log("Error processing analytics data for", plugin.manifest.name, ":", e);
        }
    });
}

function parseCommandLineArgs() {
    program
        .version(version)
        .option('-p, --port <n>', 'Specify listen port for personalization services', parseInt)
        .parse(process.argv);
}

init();
startHttpServer();

// start processing loop
setInterval(function() {
    invokeDataProcessors();
}, conf.processingInterval);