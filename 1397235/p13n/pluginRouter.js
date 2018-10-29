/**
 * This module defines a router for plugin REST APIs.
 * 
 * @module 
 * @name analytics/pluginRouter.js
 *
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 * 
 */
var _ = require('lodash');
/**
 * Register an app server route for a plugin feature
 *
 * @param plugin - An object representing the analytics plugin for which the
 * route is being registered.
 *
 * @param httpRequestHandler - The HTTP request handler with which to register the route.
 */
exports.registerPluginRoutes = function(plugin, httpRequestHandler) {
    var pluginFeatures = plugin.manifest.features;

    pluginFeatures.forEach(function(feature) {
        var handler = plugin.moduleInstance[feature.method];

        if (_.isFunction(handler)) {
            var route = "/" + plugin.manifest.category + "/" + feature.name + "/" + feature.api;

            // Associate route with plugin feature
            console.log("registering app server route =", route, "(" + plugin.manifest.name + ")");

            httpRequestHandler.get(route, function(req, res) {
                if (!res.locals.username) {
                    res.status(401).send();
                }
                else {
                    try {
                        handler.call(plugin.moduleInstance, res.locals.username, req.query, function(err, value) {
                            if (err) {
                                res.status(500).send(err);
                            }
                            else {
                                res.status(200).send(value);   
                            }
                        }); 
                    }
                    catch (e) {
                        res.status(500).send(e);  
                    }  
                }     
            });
        };
    });   
}