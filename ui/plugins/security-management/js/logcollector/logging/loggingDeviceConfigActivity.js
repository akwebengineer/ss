/**
 * A module that works with Log Device Configuration
 *
 * @module LogDeviceConfigActivity
 * 
 **/
define([
    'backbone',
    '../../../../ui-common/js/gridActivity.js',
    './views/loggingDevicesView.js'
], function(Backbone, GridActivity, LogDeviceView) {
    /**
     * Constructs a LogDeviceConfigActivity.
     */

    var LogDevicesConfigActivity = function() {

         GridActivity.call(this);
         this.getView = function () {
            this.view = new LogDeviceView({
            context: this.getContext()
            });
            
            return this.view;
        };
         

        this.model = Backbone.Model.extend({ 

        });
 
    };


    LogDevicesConfigActivity.prototype = new GridActivity();

    return LogDevicesConfigActivity;
});