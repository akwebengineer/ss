/**
 * A module that launches create active directory domain controller grid.
 *
 * @module ActiveDirectoryDomainControllerGridView
 * @author Tashi Garg <tgarg@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 **/



define([
    'backbone',
    'backbone.syphon',
    'widgets/grid/gridWidget',
    '../conf/domainControllerGridConf.js'
], function (Backbone, Syphon, GridWidget, GridConf) {

    var DomainControllerGridView = Backbone.View.extend({

        /**
         * Initialize view
         * @param options
         */
        initialize: function (options) {

            this.parentView = options.parentView;
            this.context = options.context;
            this.buildGrid();

        },

        /**
         * Build domain controller grid
         * @returns {DomainControllerGridView}
         */
        buildGrid: function () {
            var self = this,
                formConfiguration = new GridConf(self.context),
                elements = formConfiguration.getValues(),
                container = self.parentView.$el.find('#active_directory_domain_controller').empty();

            // create grid
            self.gridWidget = new GridWidget({
                container: container,
                actionEvents: {createEvent: "addEvent", updateEvent: "editEvent", deleteEvent: "deleteAction"},
                elements: elements
            });

            self.gridWidget.build();

            // add css
            container.find(".grid-widget").addClass("elementinput-domain-controller-grid");
            return self;
        }

    });

    return DomainControllerGridView;
});