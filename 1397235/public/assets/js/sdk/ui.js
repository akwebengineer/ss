/** 
 * A module that implements a set of utility functions for 
 * modifying the state of the Slipstream-provided UI elements.
 *
 * @module
 * @name Slipstream/SDK/UI
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */
define(function() {
	Slipstream.module("SDK", /** @lends UI */ function(SDK, Slipstream, Backbone, Marionette, $, _) {
		var primary_activity;

		SDK.UI = {};
		
		SDK.UI.setSecondaryNavigationVisibility = function(makeVisible, generateNavHint) {
			Slipstream.commands.execute("ui:setSecondaryNavigationVisibility", makeVisible, false, generateNavHint ? generateNavHint : true);
		}

		SDK.UI.getSecondaryNavigationVisibility = function() {
			return Slipstream.reqres.request("ui:getSecondaryNavigationVisibility");
		}

		SDK.UI.getContentPane = function() {
			return Slipstream.reqres.request("ui:getContentPane");
		}

		SDK.UI.getPrimaryActivity = function() {
			return primary_activity;
		}

		/**
         * Define a command handler that allows the primary activity i.e. the activity that currently owns the view rendered
         * in the main content pane, to be set.
         */
         Slipstream.commands.setHandler("activity:primary:set", function(activity) {
             primary_activity = activity;
         });
	});

	return Slipstream.SDK.UI;
});