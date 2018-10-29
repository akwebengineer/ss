/** 
 * A module that implements a loader for shared UI components
 *
 * @module Slipstream/ComponentLoader
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */
define(["lib/utils"], function(utils) {
	  var componentLoaderMap = {};  // maps component names to loader module path
	  var componentMap = {};        // maps component names to component instances

    Slipstream.module("ComponentLoader", /** @namespace Slipstream.ComponentLoader */ function(ComponentLoader, Slipstream, Backbone, Marionette, $, _) {
      	/**
      	 * Load a set of shared components
      	 * 
      	 * @param {String | Array<String>} components - The name(s) of the component(s) to be loaded.
      	 * @param {Function} callback - The callback to be called once all named components have been loaded.  The
      	 * callback will receive n arguments where each argument is an instance of a named component provieded in the
      	 * 'components' argument.  The component instances passed to the callback will be in the same order as the names
      	 * in the 'components' argument.
      	 */
      	function loadComponents(components, callback) {
            var loadedComponents = [];
      	    var totalLoaded = 0;

            /**
             * An internal callback that is called when an individual component's
             * loader has completed the component loading process.
             *
             * @param {Object} component - The component that was successfully loaded.
             */
        		function onComponentLoad(component) {
        		    totalLoaded++;

                loadedComponents[this.dependencyIndex] = component;
                componentMap[this.componentName] = component;

                if (totalLoaded == components.length) {  // all components loaded
                  	if (_.isFunction(callback)) {
                        callback.apply(null, loadedComponents);
                    }
                }
        		}

            var dependencyIndex = 0;

            if (_.isString(components)) {  // normalize to an array of components
                components = [components];
            };

            // load each requested component
            components.forEach(function(componentName) {
                var componentLoader = componentLoaderMap[componentName];
                var componentLoaderModulePath = componentLoader && componentLoader.loader;

                /*
              	 * Bind the onComponentLoad callback to a context that can be used to determine
              	 * which slot in the array of loaded components the newly loaded component should 
              	 * be written.  This is done so that the callback passed to loadComponents will receive its
              	 * arguments (the loaded components) in the order that the loadComponents caller requested them.
              	 *
              	 * eg. loadComponents(["foo, "bar"], function(Foo, Bar) {
              	 *         ...
              	 *     })
              	 */
                 var onLoad = $.proxy(onComponentLoad, {
                     dependencyIndex: dependencyIndex++,
                  	 componentName: componentName
  	             });
                
                 require([componentLoaderModulePath], function(module) {
      		           if (componentMap[componentName]) { 
      		               // The component has already been loaded, just invoke the callback
                         onLoad(componentMap[componentName]);
      		           }
      		           else {
        		            // Instantiate the module loader and use it to load the component.
                        if (!_.isFunction(module)) {
                            throw new Error("Loader module must return a constructor");
                        }

        		            var loaderInstance = new module();

      		              if (!(loaderInstance instanceof Slipstream.SDK.ComponentLoader)) {
      			                console.log("loader module", componentLoaderModulePath, "is not a ComponentLoader");
      		              }
      		              else {
        		                // Invoke the loader to load the component
          				          loaderInstance.loadComponent({
          				            	onLoad: onLoad
          				          });
      				          }
                    }
        			  },
        			  function(err) {
        			     console.log("Can't load component loader module", componentLoaderModulePath);
        			     console.log("Failed module: ", err.requireModules ? err.requireModules[0] : "Unknown");
        			     console.log("Stack trace:", err.stack);
        			     onLoad(undefined);
        		    });
  	        });
         }   

         ComponentLoader.addInitializer(function() {
         	   /**
         	    * Define a command handler for component:load requests
         	    *
         	    * @param {String | Array<String>} components - The name(s) of the component(s) to be loaded.
  	       	  * @param {Function} callback - The callback to be called once all named components have been loaded.  The
      	    	* callback will receive n arguments where each argument is an instance of a named component provieded in the
      	    	* 'components' argument.  The component instances passed to the callback will be in the same order as the names
      	    	* in the 'components' argument.
         	    */
    	       Slipstream.commands.setHandler("component:load", function(componentNames, callback) {
    	           console.log("got component:load request for component(s) =", componentNames); 
    	           loadComponents(componentNames, callback);
    	       });	

             /** 
              * Define an event handler for component:discovered events.
              * 
              * @param {Object} component - An object representing the shared component that has been discovered.
              */
    	       Slipstream.vent.on("component:discovered", function(component) {
    	           console.log("got component:discovered event for component =", component.name, "version =", component.version, "loaderPath =", component.loader); 
                   // Resolve the named component to the instance with the highest version number
                   var existingComponentLoader = componentLoaderMap[component.name];
                   var existingComponentVersion = (existingComponentLoader && existingComponentLoader.version) || "0.0.0";

                   if (utils.version_compare(component.version, existingComponentVersion) > 0) {
                       componentLoaderMap[component.name] = {loader: component.loader, version: component.version};
                   }
    	       });
  	     });
    });

    return Slipstream.ProviderLoader;
});