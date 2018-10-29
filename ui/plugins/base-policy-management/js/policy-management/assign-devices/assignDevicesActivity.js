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
      './views/assignDevicesFormView.js'
    ],

    function (Backbone, OverlayWidget, AssignDeviceView) {

      var  AssignDevicesActivity = {

        /**
         *  build the assign-devices overlay
         *  @params policyOptions object
         */
        launchOverlay: function(policyOptions){
          var options = policyOptions.activity.getIntent().getExtras(),
              view= new AssignDeviceView({
                activity: policyOptions.activity,
                assignDevicesURLRoot: policyOptions.assignDevicesURLRoot,
                model: policyOptions.model,
                assignDevicesContentType: policyOptions.assignDevicesContentType,
                devicesForPolicyURLRoot: policyOptions.devicesForPolicyURLRoot,
                devicesForPolicyAcceptHeader: policyOptions.devicesForPolicyAcceptHeader,

                policyManagementConstants: policyOptions.policyManagementConstants
              });
          policyOptions.activity.buildOverlay(view, options);
        }
      };

      return AssignDevicesActivity;
    });