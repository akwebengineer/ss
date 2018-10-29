/**
 * This module defines a plugin loader that can be used to load analytics plugin modules.
 * 
 * @module 
 * @name analytics/pluginLoader.js
 *
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 * 
 */

var fs = require('fs');
var path = require('path');
 /**
  *
  * @returns An array of objects with the following attributes:
  *
  * module - The constructor for the plugin's analytics module.
  * manifest - The manifest containing the plugin's metadata.
 */
exports.loadPlugins = function loadPlugins(pluginDirectory) {
    var plugins = [];

    /**
     * Fetch the manifests from the defined plugins
     * @returns An array of plugin manifests
     */
    function getPluginManifests() {
        function getPluginDirectories() {
            var pluginRoots = fs.readdirSync(pluginDirectory).filter(function (file) {
                return fs.statSync(path.join(pluginDirectory, file)).isDirectory();
            });

            return pluginRoots;
        }

        var pluginDirectories = getPluginDirectories();
        var manifests = [];

        pluginDirectories.forEach(function(dir) {
            var manifest_path = path.join(pluginDirectory, dir, "manifest.json");

            try {
                var manifest = JSON.parse(fs.readFileSync(manifest_path));
                manifest._fullPath = manifest_path;
                manifests.push(manifest);    
            }
            catch (e) {
                console.log("Invalid manifest file format", manifest_path, ". Skipping...");
            }
        }); 

        return manifests;
    }

    var manifests = getPluginManifests();

    manifests.forEach(function(manifest) {
        var pluginModulePath = path.join(path.dirname(manifest._fullPath), "js", manifest.module + ".js");
        try {
            plugins.push({
                'module': require(pluginModulePath), 
                'manifest': manifest
            });
        }
        catch (e) {
            console.log("Can't load module", pluginModulePath, "from plugin", manifest.name);
        }
    });

    return plugins;
}