/**
 * An activity that implements the App Visibility module
 *
 * @module BaseVisibilityActivity
 * Implements Application Visibility as a base.
 * new visibility feature must extend this class.
 * please see implementation of userVisibilityActivity.js
 * @author Dharma<adharmendran@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    'backbone',
    './views/appSecureLandingPage.js',
    "./views/bubbleViewToolTip.js",
    './views/gridView.js'
], function(Backbone, AppSecureLandingPageView, BubbleViewToolTip, GridView) {

	var BaseVisibilityActivity = function(){
        //default is application
        this.url = "/application";
        this.activityName = "baseVisibilityActivity";
        this.toolTipView = BubbleViewToolTip;
        this.gridView = GridView;
        //this.landingPageTitle = this.getContext().getMessage('app_secure_ilp_title'
        //
        this.landingPageTitle = function(){
            var me=this;
            return me.getContext().getMessage('app_secure_ilp_title');
        };
        //
        this.landingPageHelpTitle = function(){
            var me=this;
            return{
                "content":me.context.getMessage('app_secure_ilp_title_help'),
                "ua-help-text":me.context.getMessage("more_link"),
                "ua-help-identifier":me.context.getHelpKey("APP_VISIBILITY_OVERVIEW")
            };
        };
        //        
        this.graphTitle = function(){
            var me=this;
            return me.getContext().getMessage('app_secure_bubble_graph_title');
        };
        //        
        this.onCreate = function() {
            console.log("Created App Secure Activity");
        };
        //
        this.onStart = function() {
        	//
            console.log("Started BaseVisibilityActivity");
            var me=this;
            //
            me.setContentView(new AppSecureLandingPageView({
                "activity": this,
                "url": this.url,
                "toolTipView": me.toolTipView,
                "landingPageTitle": me.landingPageTitle(),
                "landingPageHelpTitle": me.landingPageHelpTitle(),
                "graphTitle": me.graphTitle(),
                "gridView": me.gridView
            }));
        };
        //
	};
	//
    BaseVisibilityActivity.prototype = new Slipstream.SDK.Activity();
    return BaseVisibilityActivity;
});