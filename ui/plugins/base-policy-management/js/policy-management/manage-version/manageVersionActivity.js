/**
 * Assign Devices Activity page
 *
 * @module AssignDevicesActivity
 * @author Damodhar <mdamodhar@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 * as the assign devices trigger logic is common across the policies just need to access
 * the service specific method to assign
 **/
define(
    [
      'backbone',
      'widgets/overlay/overlayWidget',
      './views/manageVersionView.js'
    ],

    function (Backbone, OverlayWidget, ManageVersionView) {

      var ManageVersionActivity = {

        /**
         *  build the assign-devices overlay
         *  @params policyOptions object
         */
        launchOverlay: function(policyOptions){
          var options = policyOptions.activity.getIntent().getExtras(),
              view= new ManageVersionView({
                activity: policyOptions.activity,
                model:policyOptions.model,
                policy:policyOptions.policy,
                params:policyOptions.params
              });
          policyOptions.activity.buildOverlay(view, options);
        }
      };
      return ManageVersionActivity;
    });
