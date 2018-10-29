/**
 * A module that works with SourceIpVisibilityActivity.
 *
 * @module SourceIpVisibilityActivity
 * @author Ashish<sriashish@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/

define([
    './baseVisibilityActivity.js',
    './views/sourceipvisibility/sourceIpVisGridView.js',
    "./views/sourceipvisibility/sourceIpVisibilityToolTip.js"
], function(BaseVisibilityActivity, GridView, BubbleViewToolTip) {
    /**
     * Constructs an SourceIpVisibilityActivity.
     */
    var SourceIpVisibilityActivity = function() {
        var me=this;
        me.url="/sourceIp";
        this.activityName = "SourceIpVisibilityActivity";
        this.toolTipView = BubbleViewToolTip;
        me.gridView = GridView;
        //
        me.landingPageTitle = function(){
            return me.getContext().getMessage('source_ip_visi_title');
        };
        me.landingPageHelpTitle = function(){
            var me=this;
            return{
                "content":me.context.getMessage('source_ip_vis_ilp_title_help'),
                "ua-help-text":me.context.getMessage("more_link"),
                "ua-help-identifier":me.context.getHelpKey("NETWORK_USER_OVERVIEW")
            };
        };
        me.graphTitle = function(){
            var me=this;
            return me.getContext().getMessage('source_ip_vis_bubble_graph_title');
        };
        //        
    }
    //
    SourceIpVisibilityActivity.prototype = new BaseVisibilityActivity();
    return SourceIpVisibilityActivity;
});