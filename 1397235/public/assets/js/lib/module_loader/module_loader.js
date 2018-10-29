/**
 * The module that cache busts plugins if BUILD_HASH is present in plugin.json
 *
 * @module ModuleLoader
 * @author Viswesh Subramanian <vissubra@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */

define(['Slipstream'],function (Slipstream) {
    var plugins = {},
        require_base_load_method = require.load;

    Slipstream.vent.on("plugin:discovered", function(plugin) {
        plugins[plugin.get("name")] = plugin.get("BUILD_HASH");
    });

    /**
     * load function to customize base require js load method.
     * @param {Object} context - requirejs internal context.
     * @param {string} moduleName - Module name of the resource.
     * @param {string} url - url of the resource being requested.
     */
    var load = function (context, moduleName, url) {
        if (url && /\/installed_plugins\//g.test(url)) {
            // If installed_plugins & plugin has BUILD_HASH, cache bust it.
            var ctx_name = url.split("/")[2];
            if (plugins[ctx_name]) {
                url = url.concat('?v=', plugins[ctx_name]);
                console.log("loaded " + url);
            }
        }
        require_base_load_method(context, moduleName, url);
    };

    /**
     * Method to override require js load method.
     */
    var overrideLoad = function () {
        require.load = load;
    };

    overrideLoad();
});