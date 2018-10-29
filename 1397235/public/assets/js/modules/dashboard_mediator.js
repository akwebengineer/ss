/** 
 * A module that implements a mediator for dashboard widgets
 *
 * @module Slipstream/DashboardMediator
 * @author Kiran Kashalkar <kkashalkar@juniper.net>
 * @author Sujatha Subbarao <sujatha@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define(function() {
    Slipstream.module("DashboardMediator", /** @namespace Slipstream.DashboardMediator */ function(DashboardMediator, Slipstream, Backbone, Marionette, $, _) {
        var dashlets  = [];
        var containers  = [];

        DashboardMediator.addInitializer(function() {
            /** 
             * Dashboard Widget Discovered event
             *
             * @event dashboard_widget:discovered
             * @type {Object}
             * @property {Object} widget - The dashboard widget that's been discovered
             */
            Slipstream.vent.on("dashboard_widget:discovered", function(widget) {
                console.log("got dashboard_widget:discovered event", JSON.stringify(widget));
                dashlets.push(widget);
            });

            /**
             * Dashboard Container Discovered event
             *
             * @event dashboard_container:discovered
             * @type {Object}
             * @property {Object} container - The dashboard container that's been discovered
             */
            Slipstream.vent.on("dashboard_container:discovered", function(container) {
                console.log("got dashboard_container:discovered event", JSON.stringify(container));
                containers.push(container);
            });

            Slipstream.reqres.setHandler("dashboard:getDashlets", function() {
                console.log('got dashboard:getDashlets event');
                return dashlets;
            });

            Slipstream.reqres.setHandler("dashboard:getContainers", function() {
                console.log('got dashboard:getContainers event');
                return containers;
            })

        });
    });

    return Slipstream.DashboardMediator;
});
