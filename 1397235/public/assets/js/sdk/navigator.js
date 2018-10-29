/** 
 * A module that updates Slipstream Navigation Dynamically and updates the breadcrumb
 * 
 *
 * @module
 * @name Slipstream/SDK/Navigator
 * @author Arvind Kannan <arvindkannan@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define(function() {
	Slipstream.module("SDK", /** @namespace Slipstream.SDK.Navigator */ function(SDK, Slipstream, Backbone, Marionette, $, _) {
		// private 

		// public
        
        SDK.Navigator = function () {}
		/**
		 * Update the navigation
		 * @memberof Slipstream.SDK.Navigator         
         * @param {Object} data - The data object containing the intent and internationalized leaf node name
		 */
		SDK.Navigator.prototype.update = /** @methodof Navigator */ function(data) {
			Slipstream.vent.trigger("nav:update", data);
	    }
	});

	return Slipstream.SDK.Navigator;
});