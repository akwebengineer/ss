/**
 * FW Rule Grid Hit Count view
 *
 * @module FWRuleGridHitCountView
 * @author Omega developer
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'backbone',
    'widgets/form/formWidget',
     'widgets/overlay/overlayWidget',
    '../../../../../base-policy-management/js/policy-management/rules/views/baseCellEditorView.js',
    '../conf/fwRuleGridHitCountConf.js',
    './fwRuleGridHitsPerDeviceView.js',
  '../constants/fwRuleGridConstants.js'
], function (Backbone, FormWidget, OverlayWidget, BaseGridCellEditor, 
             RuleGridHitCountConf, HitsPerDeviceView, PolicyManagementConstants) {

    var FWRuleGridHitCountView = Backbone.View.extend({
        events: {
            'click #btnHitOk': 'closeOverlay',
            "click #hits_per_device_link": "showHitsPerDeviceOverlay"
        },

        initialize: function () {
            this.context = this.options.context;
            this.policyObj = this.options.policyObj;
            this.model = this.options.ruleCollection.get(this.options.ruleObject.id);
            this.cuid = this.options.cuid;

            this.formConfiguration = new RuleGridHitCountConf(this.context);
        },

        render: function () {
            var self = this, level = "", percent = "";
            self.form = new FormWidget({
                "elements": self.formConfiguration.gridHitCount(),
                "container": self.el
            });

            self.form.build();

            this.$el.addClass("security-management");

            if (this.model.get("hit-count-details") !== undefined) {

                level = this.model.get("hit-count-details").level;
                if (level === "HIGH") {
                    level += " " + self.context.getMessage("hits_high");
                } else if (level === "MEDIUM") {
                    level += " " + self.context.getMessage("hits_medium");
                } else if (level === "LOW") {
                    level += " " + self.context.getMessage("hits_low");
                } 
                this.$el.find("#level label").text(level);

                percent = this.model.get("hit-count-details")["hit-percent"];
                percent = Math.round(percent * 10) / 10;
                percent += this.context.getMessage("range_desc");
                this.$el.find("#range label").text(percent);

                this.$el.find("#current_hits label").text(this.model.get("hit-count-details")["hit-count"]);
                this.$el.find("#total_hits label").text(this.model.get("hit-count-details")["total-hit-count"]);

                var dateFormat = "MMM D, YYYY",
                    lastResetTime = this.model.get("hit-count-details")["last-reset-time-stamp"],
                    lastResetFormattedDate = self.context.getMessage("no_reset_recorded"),
                    lastHitTime = this.model.get("hit-count-details")["last-hit-time-stamp"],
                    lastHitFormattedDate = self.context.getMessage("no_hit_recorded");

                if (lastResetTime !== "0" && lastResetTime != 0) {
                    lastResetFormattedDate = Slipstream.SDK.DateFormatter.format(new Date(lastResetTime), dateFormat);
                }

                if (lastHitTime !== "0" && lastHitTime != 0) {
                    lastHitFormattedDate = Slipstream.SDK.DateFormatter.format(new Date(lastHitTime), dateFormat);
                }

                this.$el.find("#last_reset label").text(lastResetFormattedDate);
                this.$el.find("#last_hit_date label").text(lastHitFormattedDate);
            }
            this.$el.find("#hits_per_device").closest(".elementinput").hide();

            return self;
        },

        showHitsPerDeviceOverlay: function() {
            var self = this;

            var hitsPerDeviceView = new HitsPerDeviceView({
                'policyObj': this.policyObj,
                'close': _.bind(this.closeOverlay, this),
                'context': this.context,
                "model" : this.model,
                "cuid": this.cuid
            });
            self.hitsPerDeviceOverlay = new OverlayWidget({
                view: hitsPerDeviceView,
                type: 'large',
                showScrollbar: true
            });

            self.hitsPerDeviceOverlay.build();

        },

        closeOverlay: function(e) {
            this.options.close(e);
        }
    });

    return FWRuleGridHitCountView;
});
