/**
 * An activity that implements the event viewer
 *
 * @module EventViewerActivity
 * @author Dharma<adharmendran@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    'backbone', 'widgets/overlay/overlayWidget', './views/eventViewer.js', 
    './views/createFilterView.js', './views/alertWizardView.js', './views/reportWizardView.js'
], function(Backbone, OverlayWidget, EventViewer, CreateFilterView, AlertWizardView, ReportWizardView) {

	var EventViewerActivity = function(){
        //
        this.onCreate = function() {
            console.log("Created EventViewer activity");
        };
        //
        this.onDestroy = function(){
            console.log("Event Viewer Activity Destroyed");
        };
        //
        this.onStart = function() {
        	//
            console.log("Started EventViewerActivity");
            console.log(this.getIntent().action);
            //
            this.eventViewer = new EventViewer.View({activity:this});
            
            var data = this.getExtras();

            switch(this.getIntent().data['mime_type']) {
                case "vnd.juniper.net.eventlogs.alleventcategories.createfilter":
                    createFilter(this, data);
                    break;

                case "vnd.juniper.net.eventlogs.alleventcategories.modifyfilter":
                    createFilter(this, data);
                    break;
                
                case "vnd.juniper.net.eventlogs.alleventcategories.createalert":
                    createAlert(this, data);
                    break;
                    
                case "vnd.juniper.net.eventlogs.alleventcategories.createreport":
                    createReport(this, data);
                    break;

                default:
                    this.setContentView(this.eventViewer);
            }
        };
        //
        createFilter = function(me, filterOptions){
            Slipstream.module("EventViewer").stop();
            createFilterOverlayLaunch(me, me.context, filterOptions.eventCategory, filterOptions.filterObj, filterOptions.filterMgmt);
        };

        createFilterOverlayLaunch = function(me, context, category, filterObj, filterMgmt){
            var view = new CreateFilterView({
                activity: me,
                eventCategory: category, 
                context: context, 
                filterObj: filterObj,
                filterMgmt:filterMgmt
            });
            me.overlayWidgetObj = new OverlayWidget({
                view: view,
                showScrollbar: true,
                type: 'medium'
            });
            me.overlayWidgetObj.build();
            if(!me.overlayWidgetObj.getOverlayContainer().hasClass("event-viewer")){
                me.overlayWidgetObj.getOverlayContainer().addClass("event-viewer");
            }
        };
        //
        createAlert = function(me, alertOptions){
            createAlertOverlayLaunch(me, me.context, alertOptions.filterObj);
        };

        createAlertOverlayLaunch = function(me, context, filterObj){
            var alertView = new AlertWizardView({
                activity: me, 
                context: context, 
                filterObj: filterObj
            });
            me.overlayWidgetObj = new OverlayWidget({
                view: alertView,
                showScrollbar: true,
                type: 'medium'
            });
            me.overlayWidgetObj.build();
            if(!me.overlayWidgetObj.getOverlayContainer().hasClass("event-viewer")){
                me.overlayWidgetObj.getOverlayContainer().addClass("event-viewer");
            }
        };
        //
        createReport = function(me, reportOptions){
            createReportOverlayLaunch(me, me.context, reportOptions.filterObj);
        };

        createReportOverlayLaunch = function(me, context, filterObj){
            var reportView = new ReportWizardView({
                activity: me, 
                context: context, 
                filterObj: filterObj
            });
            me.overlayWidgetObj = new OverlayWidget({
                view: reportView,
                showScrollbar: true,
                type: 'medium'
            });
            me.overlayWidgetObj.build();
            if(!me.overlayWidgetObj.getOverlayContainer().hasClass("event-viewer")){
                me.overlayWidgetObj.getOverlayContainer().addClass("event-viewer");
            }
        };
    }
	//
    EventViewerActivity.prototype = new Slipstream.SDK.Activity();
    return EventViewerActivity;
});