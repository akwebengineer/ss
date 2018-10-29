/**
 * A module that works with UserVisibility.
 *
 * @module UserVisibilityActivity
 * @author Dharma<adharmendran@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/

define([
    './baseVisibilityActivity.js',
    './views/uservisibility/userVisGridView.js',
    "./views/uservisibility/userVisibilityToolTip.js"
], function(BaseVisibilityActivity, GridView, BubbleViewToolTip) {
    /**
     * Constructs an UserVisibilityActivity.
     */
    var UserVisibilityActivity = function() {
        var me=this;
        me.url="/user";
        me.activityName = "UserVisibilityActivity";
        this.toolTipView = BubbleViewToolTip;
        me.gridView = GridView;
        //
        me.landingPageTitle = function(){
            return me.getContext().getMessage('user_vis_ilp_title');
        };
        me.landingPageHelpTitle = function(){
            var me=this;
            return{
                "content":me.context.getMessage('user_vis_ilp_title_help'),
                "ua-help-text":me.context.getMessage("more_link"),
                "ua-help-identifier":me.context.getHelpKey("NETWORK_USER_OVERVIEW")
            };
        };
        me.graphTitle = function(){
            var me=this;
            return me.getContext().getMessage('user_vis_bubble_graph_title');
        };
        //        
    }
    //
    UserVisibilityActivity.prototype = new BaseVisibilityActivity();
    return UserVisibilityActivity;
});