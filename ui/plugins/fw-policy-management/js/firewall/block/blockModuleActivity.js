/**
 * A module that implements a Block Module/Rule Change List Activity
 *
 * @module BlockModuleActivity
 * @author Tashi Garg <tgarg@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */
define([
    'widgets/overlay/overlayWidget',
    './blockManager.js'
], function (OverlayWidget, BlockManager) {
    /**
     * Constructs an activity.
     */

    var BlockActivity = function () {


        var self = this;
        self.onStart = function () {
            var data = this.getExtras(), blockManager;
            blockManager = new BlockManager();
            blockManager.startBlockWorkFlow({
                "input": data,
                "activity": self
            });
        };

    };

    BlockActivity.prototype = new Slipstream.SDK.Activity();

    BlockActivity.prototype.buildOverlay = function(view, options) {
        var self=this;
        this.overlay = new OverlayWidget({
            view: view,
            type: options.size || 'large',
            showScrollbar: true
        });

        this.overlay.build();
        if(!this.overlay.getOverlayContainer().hasClass(this.getContext()["ctx_name"])){
            this.overlay.getOverlayContainer().addClass(this.getContext()["ctx_name"]);
        }
    };

    return BlockActivity;
});