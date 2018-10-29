/**
 * FW Rule Grid hits per device view
 *
 * @module FWRuleGridHitsPerDeviceView
 * @author Omega developer
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'backbone',
    'widgets/form/formWidget',
    'widgets/grid/gridWidget',
    '../conf/fwRuleGridHitsPerDeviceConf.js',
    '../conf/fwRuleGridHitsPerDeviceGridConf.js',
    '../models/fwHitsPerDeviceCollection.js'
], function (Backbone, FormWidget, GridWidget, HitsPerDeviceConf, HitsPerDeviceGridConf, HitsPerDeviceCollection) {
    var FWRuleGridHitsPerDeviceView = Backbone.View.extend({

        events: {
            'click #btnHitsPerDeviceOk': 'closeOverlay'
        },

        initialize: function () {
            this.context = this.options.context;
            this.model = this.options.model;
            this.cuid = this.options.cuid;

            this.formConfiguration = new HitsPerDeviceConf(this.context);

            this.hitsPerDeviceCollection = new HitsPerDeviceCollection(
                                                this.options.policyObj.id, this.model.get("id"), this.cuid);
        },

        render: function () {
            var self = this;

            self.form = new FormWidget({
                "elements": self.formConfiguration.getElements(),
                "container": self.el
            });

            self.form.build();
            self.$el.addClass("security-management");

            self.addHitsGrid();

            return self;
        },

        addHitsGrid: function() {
            var self = this,
                hitsPerDeviceGridConf = new HitsPerDeviceGridConf(self.context),
                gridContainer = self.$el.find("#hits-per-device-grid");

            hitsPerDeviceGridConf = hitsPerDeviceGridConf.getValues();
            hitsPerDeviceGridConf.filter = self.addSearchFilter();
            self.hitsPerDeviceGridWidget = new GridWidget({
                  container: gridContainer,
                  elements: hitsPerDeviceGridConf
            });


            self.hitsPerDeviceGridWidget.build();

            self.getHitsPerDevice();
        },

        getHitsPerDevice: function () {
            var self = this;

            self.hitsPerDeviceCollection.fetch({
                success: function (collection, response, options) {
                    self.renderGrid(response);
                },
                error: function (collection, response, options) {
                    console.log('Firewall Hits per Device collection is not fetched');
                }
            });
        },

        renderGrid: function(response) {

            var self = this,
                hitsPerDevice = response['hitCountForDevice']['hitCount'];

            self.hitsPerDeviceGridWidget.reloadGrid();

            if (hitsPerDevice) {
                if (!$.isArray(hitsPerDevice)) {
                    hitsPerDevice = [hitsPerDevice];
                }
                self.hitsPerDeviceGridWidget.addRow(hitsPerDevice);
            }         
        },

        addSearchFilter : function() {
            var self = this;
            return {
                searchResult: function (tokens, renderGridData) {
                    self.hitsPerDeviceCollection.fetch({
                        filter: tokens,
                        success: function (collection, response, options) {
                            self.renderGrid(response);
                        },
                        error: function (collection, response, options) {
                            console.log('Firewall Hits per Device collection is not fetched for filter: ' + tokens);
                        }
                    });
                }
            };
        },

        closeOverlay : function(e) {
            this.options.close(e);
        }

    });

    return FWRuleGridHitsPerDeviceView;
});
