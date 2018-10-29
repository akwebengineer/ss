/**
 * A view that uses the Spinner Widget to show busy indicator spinner
 *
 * @module Spinner View
 * @author Eva Wang<iwang@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'backbone',
    'widgets/overlay/overlayWidget',
    'widgets/spinner/tests/views/activityIndicatorView'
    
], function(Backbone, OverlayWidget, ActivityIndicatorView){
    var SpinnerView = Backbone.View.extend({
        events: {
            'click #overlay_btn': 'openOverlay'
        },
    
        openOverlay: function(){
            var overlayWidgetObj,
                self = this,
                indicatorView = new ActivityIndicatorView({});
                
            overlayWidgetObj = new OverlayWidget({
                view: indicatorView,
                type: 'medium'
            });
            indicatorView.options.myOverlay = overlayWidgetObj;
            overlayWidgetObj.build();

            $("#create_zone_policy").parent().on("spinner_timeout", function(){
                overlayWidgetObj && overlayWidgetObj.destroy();
            });
                
            
        }

    });

    return SpinnerView;
});