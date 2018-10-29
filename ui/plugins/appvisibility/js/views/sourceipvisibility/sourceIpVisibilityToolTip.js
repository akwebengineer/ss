/**
 * ToolTip View for Bubble Graph for user visibility
 * @module BubbleToolTipView
 * @author Dharma<adharmendran@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
*/
define([
    "backbone",
    "../uservisibility/userVisibilityToolTip.js"
], function(Backbone, UserVisibilityToolTip){
    //
    var SourceIPVisTooltipView = UserVisibilityToolTip.extend({
        render: function(){
            var me=UserVisibilityToolTip.prototype.render.call(this);
                me.off("toolTipDataSuccess").on("toolTipDataSuccess", function(){
                me.$el.find("#blockUserButton").val(me.options.context.getMessage("block_ip_button"));
            });
            return me;
        },
        //
        getFilterKey: function(nameType){
            nameType = nameType || "IPV4";
            return this.filterUtil.LC_KEY.SOURCE_ADDRESS;
        }
    });
    //
    return SourceIPVisTooltipView;
});