/**
 *
 *
 * @module ExportPolicyActivity
 * @copyright Juniper Networks, Inc. 2015
 **/
define(
    [
      'backbone',
      'widgets/overlay/overlayWidget',
      './views/exportPolicyFormView.js'
    ],

    function (Backbone, OverlayWidget, ExportPolicyFormView) {

      var ExportPolicyActivity = {

        exportPolicyOverlayLaunch: function(policyOptions){
          var view= new ExportPolicyFormView({
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
      return ExportPolicyActivity;
    });