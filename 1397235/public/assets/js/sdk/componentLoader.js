/** 
 * An abstract ComponentLoader class for Slipstream.  
 *
 * @module 
 * @name Slipstream/SDK/ComponentLoader
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */

define(function() {
    Slipstream.module("SDK", /** @lends ComponentLoader */ function(SDK, Slipstream, Backbone, Marionette, $, _) {
        // private 

        // public

        /**
         * Construct a ComponentLoader object.
         *
         * @constructor
         * @class ComponentLoader
         * @classdesc Represents a Slipstream ComponentLoader
         */
        SDK.ComponentLoader = function() {}

        /**
         * Load the component.  This function should be overridden by concrete ComponentLoader classes.
         *
         * @param {Object} options - A set of options related to the loading of the component.
         * @param {Object} options.onLoad - The callback to be called when the component has been loaded.
         */
        SDK.ComponentLoader.prototype.loadComponent = function(options) {}
    });


    return Slipstream.SDK.ComponentLoader;
});