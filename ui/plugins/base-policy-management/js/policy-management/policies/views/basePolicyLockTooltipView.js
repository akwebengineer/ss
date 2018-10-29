/**
 * A view for policy lock tooltip
 *
 * @module BasePolicyLockTooltipView
 * @author Omega Developer
 * @copyright Juniper Networks, Inc. 2016
 */

define([
    'backbone'
], function(Backbone){

    var BasePolicyLockTooltipView = Backbone.View.extend({

        events: {
            "click #unlockPolicyLink": "unlockPolicy"
        },

        initialize: function(options) {
            this.context = options.context;
            this.policyId = options.policyId;
            this.lockInfo = options.lockInfo;
            this.gridEl = options.gridEl;
        },

        render: function() {
            var me = this, tooltipMsg = "";

            tooltipMsg = "<span>" + me.context.getMessage("POLICY_LOCK_TOOLTIP", [me.lockInfo['object-lock']['user-id']]);
            tooltipMsg += "<b><a id='unlockPolicyLink' class='cellLink'>" + me.context.getMessage("policy_unlock") + "</a></b></span>";
            
            me.$el.html(tooltipMsg);

            return this;
        },

        unlockPolicy: function() {
            this.gridEl.trigger("unlockPolicyEvent", [null, this.policyId]);
        }

    });
    return BasePolicyLockTooltipView;
});