/**
 * @author skesarwani
 * This class is launch pad for custom column.
 * Pls note, Strictly speaking this is nothing of a Slipstream activity, this is just a util class.
 */
define(
    [
      'widgets/overlay/overlayWidget',
      './views/customColumnBuilderFormView.js'
    ],
    
    function (OverlayWidget, CustomColumnFormView) {
      var CustomColumnBuilderActivity = {
        launchOverlay: function(policyOptions){
          var view= new CustomColumnFormView({
            activity: policyOptions.activity,
            params: policyOptions.params
          });
          policyOptions.activity.overlay = new OverlayWidget({
            view: view,
            type: 'medium'
          });
          policyOptions.activity.overlay.build();
        }
      };
      return CustomColumnBuilderActivity;
    });
