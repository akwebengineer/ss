/** 
 * A module that implements a cache of providers. The cache will be created when the app boots up.
 * 
 * @module provider_cache
 * @author Sanket Desai <sanketdesai@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

var fs = require('fs'),
    path = require('path'),
    provider_cache = {},
    installed_providers_root = "appProvider",

    installed_providers_path = path.join(__dirname, "..", installed_providers_root),
    relative_path = path.join("..", installed_providers_root);

/**
 * Function to add all providers to cache. 
 * 
 * It will loop through all the providers available in 'installed_providers_path' and load them in cache.
 * The funtion will be triggered only once when the app is started.
 *
 * For example, if there is only one provider available named 'whoAmIProvider', then the cache will be:
 * 
 *     provider_cache: {
 *			'whoAmIProvider': require({path_to_provider_dir}/whoAmIProvider.js)
 *		}
 *
 */
var add_provider_to_cache = function() {

    var list = fs.readdirSync(installed_providers_path);
    list.forEach(function(file) {
   
        var providerName = file.split('.');
        var providerPath = path.join(relative_path, file);
        provider_cache[providerName[0]] = require(providerPath);
    
    });
 
};

exports.init = add_provider_to_cache;


exports.provider_cache = provider_cache;
