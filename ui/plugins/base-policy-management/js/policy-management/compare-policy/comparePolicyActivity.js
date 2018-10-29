/**
 created by wasima on 8/9/15
 **/
define(
    [
      'backbone',
      'widgets/overlay/overlayWidget',
      './views/comparePolicyView.js'
    ],

    function (Backbone, OverlayWidget, ComparePolicyView) {

      var ComparePolicyActivity = {


        launchOverlay: function(policyOptions){
          var options = policyOptions.activity.getIntent().getExtras(),
              view= new ComparePolicyView({
                activity: policyOptions.activity,
                params : policyOptions.params,
                obj : policyOptions.obj
              });
          options.size = "xlarge";
          policyOptions.activity.buildOverlay(view,options);
        }
      };
      return ComparePolicyActivity;
    });