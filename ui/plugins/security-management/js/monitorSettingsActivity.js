/**
 * A module that works with monitor settings.
 *
 * @module monitorSettingsActivity
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    'widgets/overlay/overlayWidget',
    'widgets/confirmationDialog/confirmationDialogWidget',
    '../../ui-common/js/views/monitorSettingsView.js',
    '../../ui-common/js/common/intentActions.js'

], function(
        OverlayWidget,
        ConfirmationDialog,
        View,
        IntentActions) {
    /**
     * Constructs a MonitorSettingsActivity.
     */
    var MonitorSettingsActivity = function() {

        this.onCreate = function() {
            console.log("Created MonitorSettingsActivity");
        };

        this.onStart = function() {
            console.log("Started MonitorSettingsActivity");
            switch(this.getIntent().action) {
                
                case Slipstream.SDK.Intent.action.ACTION_LIST:
                default:
                    this.onListIntent();
            }
        };

        this.onListIntent = function() {
            this.view = new View({
                activity: this
            });
            this.setContentView(this.view);
        };

    }

    MonitorSettingsActivity.prototype = new Slipstream.SDK.Activity();

    return MonitorSettingsActivity;
});
