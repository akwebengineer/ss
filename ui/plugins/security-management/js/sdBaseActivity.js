/**
 * 
 * @module SDDeviceActivity
 * @author svaibhav
 * @copyright Juniper Networks, Inc. 2015
 */
define([ 'widgets/overlay/overlayWidget' ], function(OverlayWidget) {
  /**
   * Constructs a GridActivity.
   */
  var SDDeviceActivity = function() {

    /**
     *  This method will be overide in child
     */
    this.onStart = function() {

    };

    this.buildOverlay = function(view, options) {
      this.overlay = new OverlayWidget({
        view : view,
        type : options.size || 'large',
        showScrollbar : true
      });

      this.overlay.build();
      if(!this.overlay.getOverlayContainer().hasClass(this.getContext()["ctx_name"])){
        this.overlay.getOverlayContainer().addClass(this.getContext()["ctx_name"]);
      }
    };
  };
  return SDDeviceActivity;
});
