/**
 * A view to list policy - device page
 *
 * @module BasePolicyDeviceGridView
 * @author Vinamra <vinamra@juniper.net>
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
          this.cuid = Slipstream.SDK.Utils.url_safe_uuid();
        },

        // On click of rules count launch the rules view
        launchRulesView: function (e) {
           var self=this;
           var deviceId = $(e.target).attr('data-policy-obj');

           if(_.isEmpty(deviceId)) return;
           // Launch the activity for associated rules view
           var intent = new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_LIST,
               {
                   mime_type: self.getMimeType()
               }
           );
           intent.putExtras({objectId: deviceId, view:'rules'});
           this.options.context.startActivity(intent);
        },

        getMimeType : function() {

        }
    });

    return BasePolicyDeviceGridView;
});
