/**
 * A module for the Policy Count based dashlets.
 *
 * @module top10PolicyCountDashletView
 * @author Dennis Park <dpark@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    '../models/policyDataCollection.js',
    '../views/top10DashletView.js',
    '../conf/defaultDashletConf.js'
    ], function (DeviceDataCollection, Top10DashletView, DashletConf) {
       /**
     * Constructs a DashletView
     */
     var DashletView = Top10DashletView.extend({        
        initialize: function () {
            this.context = new Slipstream.SDK.ActivityContext(this.options.context.ctx_name, this.options.context.ctx_root);

            this.customData = this.options.customInitData;
            if (!this.customData) {
                return;
            }

            if (this.customData.template) {
                this.conf = new DashletConf(this.context);
                this.dashletConf = this.conf.getValues()[this.customData.template];
            }

            if (!(this.customData.chartType)) {
                var defaults = JSON.parse(JSON.stringify(this.conf.getValues().defaults));
                var dashletSettings = $.extend(true, defaults, this.dashletConf);

                this.customData.chartType = dashletSettings.chartType;
                this.customData.queryParams = dashletSettings.params;
                this.customData.show_top = dashletSettings.params.count;
            }

            if (this.options.filters) {
                this.filters = this.options.filters;
            }
            var acceptType = 'application/vnd..sd.policy-hit-count-manager.policies-with-no-hit-rule-counts+json;q="0.01";version="1"';
            this.dataModel = new DeviceDataCollection({accept: acceptType});
            this.dataModel.on('sync', this.displayChart, this);
            this.moreDetails = null; 

            return this;
        }
     });

    return DashletView;
});