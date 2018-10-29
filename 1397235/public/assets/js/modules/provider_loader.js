/** 
 * A module that implements a loader for provider modules
 *
 * @module Slipstream/ProviderLoader
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define(['../conf/global_config'],function(globalConf) {
	var providerSchemeMap = {};

    Slipstream.module("ProviderLoader", /** @namespace Slipstream.ProviderLoader */ function(ProviderLoader, Slipstream, Backbone, Marionette, $, _) {
    	function loadProviders() {
    		var loadPromises = [];

            Object.keys(providerSchemeMap).forEach(function(key) {
            	providerList = providerSchemeMap[key];

            	providerList.forEach(function(providerInfo) {
                    loadPromises.push(loadProvider(providerInfo.provider, providerInfo.options));  
                });      
            }); 

            $.when.apply(null, loadPromises).then(function() {
            	Slipstream.vent.trigger("provider:afterAllLoaded");   	
            });
    	};

    	function loadProvider(provider, options) {
		    console.log("loading provider", JSON.stringify(provider));
		    var deferred = $.Deferred();

		    require([provider.module], function(module) {
		        module_instance = new module();

                if (!(module_instance instanceof options.type)) {
	                console.log("module", provider.module, "is not the correct type");
                }
		        
		        module_instance.context = options.context || {};
		        provider.module_instance = module_instance;

		        if (options.onLoad) {
		        	options.onLoad(module_instance, provider);
		        }

		        deferred.resolve();
		    }, 
		    function(err) {
		       console.log("Can't load provider module", provider.module);
		       console.log("Failed module: ", err.requireModules ? err.requireModules[0] : "Unknown");
		       console.log("Stack trace:", err.stack);
		       deferred.resolve();
		    });

            return deferred.promise();
	   }  

	   function startProvider(scheme) {
            if (providerSchemeMap[scheme]) {
            	console.log("starting providers with scheme", scheme);

		   	    providerSchemeMap[scheme].forEach(function(providerInfo) {
		   	    	Slipstream.commands.execute("nls:loadBundle", providerInfo.options.context);
		   	    	Slipstream.vent.trigger("provider:beforeStart", providerInfo.provider);
			        providerInfo.provider.module_instance.onCreate(getProviderOptions(providerInfo.provider));
			        providerInfo.provider.module_instance.onStart(); 
			        Slipstream.vent.trigger("provider:afterStart", providerInfo.provider);   
		   	    });

		   	    console.log("providers with scheme", scheme, "have been started");
		   	}
		   	else {
		   		console.log("no providers with scheme", scheme, "to be started");
		   	}
	   }

        /**
		 * Returns configuration object related to the provider scheme.
         * @param {Object} provider - provider
         * @returns {Object} configuration object from global_config
         */
        function getProviderOptions(provider) {
            var scheme = provider.uri.scheme(),
				moduleIdentifier = new RegExp(scheme.charAt(0).toUpperCase() + scheme.slice(1) + "Provider.js"),
                confIdentifier = provider.module.split("/").pop().replace(moduleIdentifier,'');

            return globalConf[scheme] && globalConf[scheme][confIdentifier];
        }

       ProviderLoader.addInitializer(function() {
	       Slipstream.commands.setHandler("provider:load", function(provider, options) {
	           console.log("got provider:load request for provider =", JSON.stringify(provider)); 

	           var providerList = providerSchemeMap[provider.uri.scheme()];

	           if (!providerList) {
	               providerList = [];
	               providerSchemeMap[provider.uri.scheme()] = providerList;
	           }

	           providerList.push({provider:provider, options:options}); 
	       });	

	       Slipstream.commands.setHandler("provider:start", function(scheme) {
	           console.log("got provider:start request for scheme =", scheme); 
	           startProvider(scheme);   
	       });	

	       Slipstream.vent.on("plugins:afterDiscovery", function() {
               loadProviders();
	       });
	    });
    });

    return Slipstream.ProviderLoader;
});