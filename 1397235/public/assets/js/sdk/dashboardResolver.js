/** 
 * The DashboardResolver module defines the interface between a plugin and the dashboard.
 * 
 * @module 
 * @name Slipstream/SDK/DashboardResolver
 * @author Sujatha Subbarao <sujatha@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */
define(function() {
    Slipstream.module("SDK", /** @lends DashboardResolver */ function(SDK, Slipstream, Backbone, Marionette, $, _) {
        // private 

        // public

        /**
         * Construct a DashboardResolver
         *
         * @constructor
         * @class DashboardResolver
         * @classdesc Represents a Slipstream DashboardResolver
         */
        SDK.DashboardResolver = function() {}

        SDK.DashboardResolver.prototype.getDashlets = function() {
            return Slipstream.request("dashboard:getDashlets");
        }

        SDK.DashboardResolver.prototype.getContainers = function() {
            return Slipstream.request("dashboard:getContainers");
        }

    });

    return Slipstream.SDK.DashboardResolver;
});