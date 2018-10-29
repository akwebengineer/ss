/**
 * A view to manage app-firewall policy page
 *
 * @module AppFwPoliciesView
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    '../../../../../ui-common/js/views/gridView.js'
], function (GridView) {

    var AppFwPoliciesView = GridView.extend({

        events: {
            "click .cellLink": "launchRulesView"
        },

        // On click of policy name launch the rules view
        launchRulesView: function (e) {
            var me = this, intent, policyObj;
            policyId = $(e.target).attr('data-policy-obj');

            me.cuid = Slipstream.SDK.Utils.url_safe_uuid();
            // Launch the activity for associated rules view
            intent = new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_LIST,
                {
                    mime_type: 'vnd.juniper.net.appfw.policies.rules'
                }
            );
            intent.putExtras({data: policyId, cuid:me.cuid});
            me.options.activity.getContext().startActivity(intent);
        }

    });

    return AppFwPoliciesView;
});