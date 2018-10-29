/**
 * A view to list ips policy template page
 *
 * @module IpsPolicyTemplateGridView
 * @author Ashish Vyawahare <avyaw@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    '../../../../../ui-common/js/views/gridView.js'
], function (GridView) {

    var BasePolicyDeviceGridView = GridView.extend({

        events: {
            "click.cellLink": "launchRulesView"
        },

        initialize: function (options) {
          this.conf = options.conf;
          this.actionEvents= options.actionEvents;
          this.context = options.context;
        },

       // On click of rules count launch the rules view
        launchRulesView: function (e) {
           var self=this;
           if($(e.target).attr('data-policy-obj')){
             var policyId = $(e.target).attr('data-policy-obj');
             // Launch the activity for associated rules view
             var intent = new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_LIST,
                 {
                     mime_type: self.getMimeType()
                 }
             );
             intent.putExtras({objectId: policyId, view:'rules'});
             this.options.context.startActivity(intent);
         }
        },

        getMimeType : function() {
             return  "vnd.juniper.net.ips.policy-templates";
        }
    });

    return BasePolicyDeviceGridView;
});

