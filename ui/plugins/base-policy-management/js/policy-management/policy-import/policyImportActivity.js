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
      './views/importPolicyView.js'
    ],

    function (Backbone, OverlayWidget, ImportPolicyView) {

      var ImportPolicyActivity = {

      ImportPolicyActivityOverlay: function(policyOptions){

          var view= new ImportPolicyView({
            activity: policyOptions.activity,
            params: policyOptions.params
          });

          policyOptions.activity.overlay = new OverlayWidget({
            view: view,
            type: 'small',
            height: '680px'
          });

          policyOptions.activity.overlay.build();

        }
      };
      return ImportPolicyActivity;
    });
