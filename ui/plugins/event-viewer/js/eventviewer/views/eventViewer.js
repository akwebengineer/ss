/**
 *  Main Event Viewer module
 *  
 *  @module EventViewer
 *  @author dharma<adharmendran@juniper.net>
 *  @copyright Juniper Networks, Inc. 2015
 * */
define([
    'backbone', 'widgets/tabContainer/tabContainerWidget', './summaryView.js', './detailView.js', './mapView.js', 'text!../templates/EventViewer.html', 
    'lib/template_renderer/template_renderer', 'widgets/spinner/spinnerWidget', '../widgets/timeSpanWidget.js', './customTimeView.js', 
    'widgets/overlay/overlayWidget', '../conf/configs.js', '../conf/timeRangeConstants.js', '../service/eventViewerService.js', "../utils/eventViewerConstants.js", 
    "text!../../../../ui-common/js/common/templates/helpToolTip.html", "widgets/tooltip/tooltipWidget", '../../../../ui-common/js/mixins/PersistenceMixin.js'],
    function(Backbone, TabContainerWidget, SummaryView, DetailView, MapView, EventViewerTemplate, TemplateRenderer, SpinnerWidget, TimeSpanWidget, 
        CustomTimeView, OverlayWidget, Configs, TimeRangeConstants, EventViewerService, Constants, HelpTemplate, TooltipWidget, PersistenceMixin){

        Slipstream.module("EventViewer", function(EventViewer, Slipstream, Backbone, Marionette, $, _){
            //
            EventViewer.View = Backbone.View.extend({

                events:{
                    "click .ev-custom-time-selector": "customTimeSelector",
                    "click .ev-pre-defined-selector": "onPredefinedTimeRangeClick",
                    "click #ev-show-hide-section" : "showHideTimeWidgetSection",
                    "click .ev-refresh-button": "onRefreshClick"
                },
                beforeClose: function(){
                    console.log("Event Viewer going to close");
                },
                //
                close: function(){
                    console.log("Event Viewer closed");
                    var me=this;
                    //garbage collect and release the memory of summaryView
                    me.summaryView.remove();
                    me.detailView.remove();
                },
                //
                afterClose: function(){
                    console.log("Event Viewer closed done");
                },
                //
                initialize: function (options) {
                    this.activity = options.activity;
                    this.context = options.activity.context;
                    this.configs = new Configs(this.context);
                    this.service = new EventViewerService({
                        "configs": this.configs
                    });
                    this.preferencesPath = this.context['ctx_name'] + ":eventViewer:EVPreferences";
                    this.preferences = {
                        timeRange : {
                            startTime : new Date() - (7200000 / 4),
                            endTime : (new Date()).getTime(),
                        }
                    }
                },
                /*
                returns last 1 hr time range
                */
                getOneHourTimeRange: function(){
                    var timeRange = {},
                        endDate = new Date(),
                        startDate = new Date(endDate - (7200000 / 2));
                    //
                    timeRange['startTime'] = new Date(startDate/*.setSeconds(0)*/);
                    timeRange['endTime'] = new Date(endDate/*.setSeconds(0)*/);
                    //
                    return timeRange;
                },
                //
                /*
                returns last 30 min time range
                */
                getThirtyMinsTimeRange: function(){
                    var timeRange = {},
                        endDate = new Date(),
                        startDate = new Date(endDate - (7200000 / 4));
                    //
                    timeRange['startTime'] = new Date(startDate/*.setSeconds(0)*/);
                    timeRange['endTime'] = new Date(endDate/*.setSeconds(0)*/);
                    //
                    return timeRange;
                },
                /*
                returns last 2 hours time ranges
                */
                getTwoHoursTimeRange: function(){
                    var timeRange = {},
                        endDate = new Date(),
                        startDate = new Date(endDate - 7200000);
                    //
                    timeRange['startTime'] = new Date(startDate/*.setSeconds(0)*/);
                    timeRange['endTime'] = new Date(endDate/*.setSeconds(0)*/);
                    //
                    return timeRange;
                },
                //
                /*
                returns last 4 hours time ranges
                */
                getFourHoursTimeRange: function(){
                    var timeRange = {},
                        endDate = new Date(),
                        startDate = new Date(endDate - (7200000 * 2));
                    //
                    timeRange['startTime'] = new Date(startDate/*.setSeconds(0)*/);
                    timeRange['endTime'] = new Date(endDate/*.setSeconds(0)*/);
                    //
                    return timeRange;
                },
                //
                /*
                returns last 8 hours time ranges
                */
                getEightHoursTimeRange: function(){
                    var timeRange = {},
                        endDate = new Date(),
                        startDate = new Date(endDate - (7200000 * 4));
                    //
                    timeRange['startTime'] = new Date(startDate/*.setSeconds(0)*/);
                    timeRange['endTime'] = new Date(endDate/*.setSeconds(0)*/);
                    //
                    return timeRange;
                },
                //
                /*
                returns last 8 hours time ranges
                */
                getSixteenHoursTimeRange: function(){
                    var timeRange = {},
                        endDate = new Date(),
                        startDate = new Date(endDate - (7200000 * 8));
                    //
                    timeRange['startTime'] = new Date(startDate/*.setSeconds(0)*/);
                    timeRange['endTime'] = new Date(endDate/*.setSeconds(0)*/);
                    //
                    return timeRange;
                },
                //
                /*
                returns last 8 hours time ranges
                */
                getTwentyFourHoursTimeRange: function(){
                    var timeRange = {},
                        endDate = new Date(),
                        startDate = new Date(endDate - (7200000 * 12));
                    //
                    timeRange['startTime'] = new Date(startDate/*.setSeconds(0)*/);
                    timeRange['endTime'] = new Date(endDate/*.setSeconds(0)*/);
                    //
                    return timeRange;
                },
                toggleTimeRangeSelection: function(elementToToggle){
                    var me=this;
                    $(me.containers.mainContainer.find(".ev-time-ranges-links")).each(function(){
                        $(this).addClass("ev-time-ranges-links-de-selected");
                    });
                    //
                    $(elementToToggle).removeClass("ev-time-ranges-links-de-selected").addClass("ev-time-ranges-links-selected");
                    //                
                },
                //
                onRefreshClick: function(event){
                    var me=this;
                    me.$currentPredefinedTimeLinkTarget.trigger("click");
                },
                //
                onPredefinedTimeRangeClick: function(event){
                    var me=this,
                        linkId=$(event.currentTarget).data("linkid");
                    //
                    me.$currentPredefinedTimeLinkTarget = $(event.currentTarget);
                    //
                    me.persistConfig({
                        "selectedTime":{
                            "linkId": linkId,//selected links - 30m, 1h so on
                            "customTimeRange": undefined//store start and end time in case of custom - for predefined this is undefined
                        }
                    });
                    //
                    if(linkId !== 5){//CUSTOM
                        me.toggleTimeRangeSelection(event.currentTarget);
                    }
                    //
                    switch (linkId){
                        case -2:
                            me.currentTimeRange = me.getThirtyMinsTimeRange();
                            me.detailView.selectedTimeRange = TimeRangeConstants.THIRTY_MINS;
                            break;
                        case -1:
                            me.currentTimeRange = me.getOneHourTimeRange();
                            me.detailView.selectedTimeRange = TimeRangeConstants.ONE_HOUR;
                            break;
                        case 0:
                            me.currentTimeRange = me.getTwoHoursTimeRange();
                            me.detailView.selectedTimeRange = TimeRangeConstants.TWO_HOURS;
                            break;
                        case 1:
                            me.currentTimeRange = me.getFourHoursTimeRange();
                            me.detailView.selectedTimeRange = TimeRangeConstants.FOUR_HOURS;
                            break;
                        case 2:
                            me.currentTimeRange = me.getEightHoursTimeRange();
                            me.detailView.selectedTimeRange = TimeRangeConstants.EIGHT_HOURS;
                            break;
                        case 3:
                            me.currentTimeRange = me.getSixteenHoursTimeRange();
                            me.detailView.selectedTimeRange = TimeRangeConstants.SIXTEEN_HOURS;
                            break;
                        case 4:
                            me.currentTimeRange = me.getTwentyFourHoursTimeRange();
                            me.detailView.selectedTimeRange = TimeRangeConstants.TWENTY_FOUR_HOURS;
                            break;
                    };
                    me.detailView.currentTimeRange = me.currentTimeRange;
                    me.buildTimeRange(me.currentTimeRange);
                },

                showHideTimeWidgetSection: function(event) {
                    var me = this, appliedClass = $(event.currentTarget).hasClass('ev-hide-section') ? true: false;

                    switch(appliedClass) {
                        case true:
                            me.$el.find(".ev-custom-time").hide();
                            me.$el.find(".ev-time-span-selector").hide();
                            me.$el.find(".ev-last-updated").hide();

                            $("#ev-show-hide-link").text(me.context.getMessage("ev_time_picker_widget_show"));
                            $("#ev-show-hide-link").removeClass("ev-hide-link").addClass("ev-show-link");
                            $("#ev-show-hide-link-arrow").removeClass("ev-arrow-up").addClass("ev-arrow-down");
                            $("#ev-show-hide-section").removeClass("ev-hide-section").addClass("ev-show-section");
                            $('#gbox_ev_detail_grid_updated').css('height',"+=150px"); //increase size of grid when time range slide is hidden PR 1216101
                            break;

                        case false:
                             me.$el.find(".ev-custom-time").show();
                             me.$el.find(".ev-time-span-selector").show();
                             me.$el.find(".ev-last-updated").show();

                             $("#ev-show-hide-link").text(me.context.getMessage("ev_time_picker_widget_hide"));
                             $("#ev-show-hide-link").removeClass("ev-show-link").addClass("ev-hide-link");
                             $("#ev-show-hide-link-arrow").removeClass("ev-arrow-down").addClass("ev-arrow-up");
                             $("#ev-show-hide-section").removeClass("ev-show-section").addClass("ev-hide-section");
                             $('#gbox_ev_detail_grid_updated').css('height',"-=150px"); //decrease size of grid when time range slide is shown PR 1216101
                             break;
                    };
                },
                //
                refreshView: function(){
                    var me=this,
                        currentActiveTabIndex = me.tabContainerWidget.getActiveTabByIndex(),
                        filter = {
                            timeRange : me.currentTimeRange
                        };
                    //
                    me.updateTimeRangeDisplay();
                    me.updateRefreshTime();
                    if(currentActiveTabIndex === 0){
                        me.refreshSummaryView(filter);
                    }else if(currentActiveTabIndex === 1){
                        me.refreshDetailView(filter);    
                    }
                },
                //
                customTimeSelector : function(event){
                    console.log("Select custom time range");
                    event.preventDefault();
                    var me = this, end = new Date(), elementToToggle = event.currentTarget, start = new Date(end - (7200000/4));
                    me.$currentPredefinedTimeLinkTarget = $(event.currentTarget);
                    start = new Date(start/*.setSeconds(0)*/);
                    end = new Date(end/*.setSeconds(0)*/);
                    if(!me.timeRangeDuration){
                        me.timeRangeDuration = {
                            "endTime" : end,
                            "startTime" : start
                        }
                    }

                    var customView = new CustomTimeView({"context": me.context, "currentTimeSelection": me.timeRangeDuration}),
                            conf = {
                                view: customView,
                                cancelButton: true,
                                okButton: true,
                                showScrollbar: false,
                                type: 'xsmall'
                            };
                        //
                        me.overlayWidgetObj = new OverlayWidget(conf);
                        me.overlayWidgetObj.build();
                        if(!me.overlayWidgetObj.getOverlayContainer().hasClass("event-viewer")){
                            me.overlayWidgetObj.getOverlayContainer().addClass("event-viewer");
                        }
                        customView.$el.find(".ev_custom_time_error").hide();
                        //
                        me.overlayWidgetObj.getOverlay().$el.find('#ok').on('click', function(event){
                            me.toggleTimeRangeSelection(elementToToggle);
                            var customTime = customView.getTime(),
                                start = customTime.startTime.getTime(), end = customTime.endTime.getTime();
                            if(start >= end){
                                customView.$el.find(".ev_custom_time_error").show();
                                setTimeout(function(){
                                    customView.$el.find(".ev_custom_time_error").hide();
                                }, 3000);
                                return false;
                            } else {
                                customView.$el.find(".ev_custom_time_error").hide();
                                me.detailView.selectedTimeRange = TimeRangeConstants.CUSTOM;
                                console.log(customTime);
                                me.timeRangeDuration = customTime;
                                //
                                me.persistConfig({
                                    "selectedTime":{
                                        "linkId": 5,//5 is for custom selection
                                        "customTimeRange": {//store start and end time in case of custom
                                            "startTime": start,
                                            "endTime": end
                                        }
                                    }
                                });
                                //
                                me.detailView.currentTimeRange = customTime;
                                me.buildTimeRange(customTime);
                            }
                        });
                },

                getHeadingAndHelpTextForMimeType: function(mime_type){
                    //var heading = 'Events & Logs';
                    var me=this,
                        heading = {
                            "title": me.context.getMessage("ev_ilp_all_events_title"),
                            "title-help":{
                                 "content" : me.context.getMessage("ev_ilp_all_events_title_help"),
                                 "ua-help-text":me.context.getMessage("more_link"),
                                 "ua-help-identifier":me.context.getHelpKey("EVENT_LOG_OVERVIEW")
                            }
                        };
                    switch(mime_type){
                        case 'vnd.juniper.net.eventlogs.firewall':
                            heading = {
                                "title": me.context.getMessage("ev_ilp_firewall_title"),
                                "title-help":{
                                     "content" : me.context.getMessage("ev_ilp_firewall_title_help"),
                                     "ua-help-text":me.context.getMessage("more_link"),
                                     "ua-help-identifier":me.context.getHelpKey("EVENT_LOG_FIREWALL_OVERVIEW")
                                }
                            };
                            break;
                        case 'vnd.juniper.net.eventlogs.webfiltering':
                            heading = {
                                "title": me.context.getMessage("ev_ilp_web_filtering_title"),
                                "title-help":{
                                    "content" : me.context.getMessage("ev_ilp_web_filtering_title_help"),
                                    "ua-help-text":me.context.getMessage("more_link"),
                                    "ua-help-identifier":me.context.getHelpKey("EVENT_LOG_WEB_FILTERING_OVERVIEW")
                                }
                            };
                            break;
                        case 'vnd.juniper.net.eventlogs.vpn':
                            heading = {
                                "title": me.context.getMessage("ev_ilp_vpn_title"),
                                "title-help":{
                                    "content" : me.context.getMessage("ev_ilp_vpn_title_help"),
                                    "ua-help-text":me.context.getMessage("more_link"),
                                    "ua-help-identifier":me.context.getHelpKey("EVENT_LOG_VPN__OVERVIEW")
                                }
                            };
                            break;
                        case 'vnd.juniper.net.eventlogs.contentfiltering':
                            heading = {
                                "title": me.context.getMessage("ev_ilp_content_filtering_title"),
                                "title-help":{
                                    "content" : me.context.getMessage("ev_ilp_content_filtering_title_help"),
                                    "ua-help-text":me.context.getMessage("more_link"),
                                    "ua-help-identifier":me.context.getHelpKey("EVENT_LOG_CONTENT_FILTERING_OVERVIEW")
                                }
                            };
                            break;
                        case 'vnd.juniper.net.eventlogs.antispam':
                            heading = {
                                "title": me.context.getMessage("ev_ilp_anti_spam_title"),
                                "title-help":{
                                     "content" : me.context.getMessage("ev_ilp_anti_spam_title_help"),
                                     "ua-help-text":me.context.getMessage("more_link"),
                                     "ua-help-identifier":me.context.getHelpKey("EVENT_LOG_ANTISPAM_OVERVIEW")
                                }
                            };
                            break;
                        case 'vnd.juniper.net.eventlogs.antivirus':
                            heading = {
                                "title": me.context.getMessage("ev_ilp_anti_virus_title"),
                                "title-help":{
                                     "content" : me.context.getMessage("ev_ilp_anti_virus_title_help"),
                                     "ua-help-text":me.context.getMessage("more_link"),
                                     "ua-help-identifier":me.context.getHelpKey("EVENT_LOG_ANTIVIRUS_OVERVIEW")
                                }
                            };
                            break;
                        case 'vnd.juniper.net.eventlogs.ips':
                            heading = {
                                "title": me.context.getMessage("ev_ilp_ips_events_title"),
                                "title-help":{
                                     "content" : me.context.getMessage("ev_ilp_ips_events_title_help"),
                                     "ua-help-text":me.context.getMessage("more_link"),
                                     "ua-help-identifier":me.context.getHelpKey("EVENT_LOG_IPS_OVERVIEW")
                                }
                            };
                            break;
                        default:
                            heading = {
                                "title": me.context.getMessage("ev_ilp_all_events_title"),
                                "title-help":{
                                     "content" : me.context.getMessage("ev_ilp_all_events_title_help"),
                                     "ua-help-text":me.context.getMessage("more_link"),
                                     "ua-help-identifier":me.context.getHelpKey("EVENT_LOG_OVERVIEW")
                                }
                            };
                    }
                    return heading;
                },
                /**
                builds the spinner and returns it. Use the returned spinner to destroy() it later
                */
                displaySpinner: function(container, message){
                    var spinner = new SpinnerWidget({
                                        "container": container,
                                        "statusText": message
                                    }).build();
                    return spinner;
                },
                destroySpinner:function(spinner){
                    spinner.destroy();
                },
                //        
                isEmpty: function(el){
                    return !$.trim(el.html());
                },
                //
                refreshSummaryView: function(filter){
                    var me=this;
                    me.summaryView.refreshContentView({"filter": filter}); 
                },
                //
                refreshDetailView: function(filter){
                    var me=this;
                    //
                    me.detailView.currentTimeRange = filter.timeRange;
                    if(!me.isEmpty(me.detailView.$el.find(".ev-detail-view"))){
                        me.detailView.refreshContentView({"filter": filter});
                    }
                },
                //
                updateTimeRangeDisplay: function(){
                    var me=this;
                    me.containers.timeRangeDisplayContainer.html("(" + me.configs.getTimeRangeToDisplay(me.currentTimeRange) + ")");
                },
                //
                buildTimeRange:function(date){
                    var me = this;
                        //timeRangeIsRendering = true;
                        //spinner = me.displaySpinner(me.containers.timeSpanContainer, me.context.getMessage("ev_summary_ts_loading"));
                        
                    var afterTimeRangeSetFn = function(event, data){
                        var start = new Date(data.min), end = new Date(data.max);
                        var filter = {
                            timeRange : {
                                startTime : new Date(start),
                                endTime : new Date(end)
                            }
                        };
                        //
                        me.currentTimeRange = filter.timeRange;
                        //
                        /*
                        var timeObj = {
                            startTime : me.currentTimeRange.startTime.getTime(),
                            endTime : me.currentTimeRange.endTime.getTime()
                        };
                        me.preferences.timeRange = $.extend({}, me.preferences.timeRange, timeObj);
                        me.persistConfig(me.preferences);*/
                        //
                        if(me.detailView){
                            me.detailView.currentTimeRange = me.currentTimeRange;
                        }
                        //
                        if(!me.timeRangeIsRendering){
                            me.refreshView();    
                        }
                        //
                        me.timeRangeIsRendering = false;
                    };
                    if(!date){
                        if(me.persistedTimeRange){
                            date = {
                                startTime : new Date(me.persistedTimeRange.startTime),
                                endTime : new Date(me.persistedTimeRange.endTime)
                            } 
                        }
                    };
                    //
                    if(date){
                        //
                        me.timeRangeWidget = new TimeSpanWidget({
                            "el": me.containers.timeSpanContainer,
                            "afterSetTimeRange": afterTimeRangeSetFn,
                            "startTime":date.startTime,
                            "endTime":date.endTime,
                            "eventCategory": me.eventCategory
                        });
                    }else{
                        me.timeRangeWidget = new TimeSpanWidget({
                            "el": me.containers.timeSpanContainer,
                            "afterSetTimeRange": afterTimeRangeSetFn,
                            "eventCategory": me.eventCategory
                        });
                    };
                    //
                },

                getEventCatForMimeType: function(mime_type){
                    var eventCat = 'EVENT LOGS';
                    switch(mime_type){
                        case 'vnd.juniper.net.eventlogs.firewall':
                            eventCat = 'FIREWALL';
                            break;
                        case 'vnd.juniper.net.eventlogs.webfiltering':
                            eventCat = 'WEB-FILTERING';
                            break;
                        case 'vnd.juniper.net.eventlogs.vpn':
                            eventCat = 'VPN';
                            break;
                        case 'vnd.juniper.net.eventlogs.contentfiltering':
                            eventCat = 'CONTENT-FILTERING';
                            break;
                        case 'vnd.juniper.net.eventlogs.antispam':
                            eventCat = 'ANTI-SPAM';
                            break;
                        case 'vnd.juniper.net.eventlogs.antivirus':
                            eventCat = 'ANTI-VIRUS';
                            break;
                        case 'vnd.juniper.net.eventlogs.ips':
                            eventCat = 'IPS';
                            break;
                        default:
                            eventCat = 'ALL EVENTS';

                    }
                    return eventCat;
                },
                //
                onShow:function(){
                    console.log("Event Viewer page showed");
                },
                //
                buildTabs: function(){
                    var me = this, filter,
                        end = new Date(), 
                        start = new Date(end - (7200000/4));

                    if(me.persistedTimeRange){
                        filter = {
                            "timeRange" : {
                                startTime : new Date(me.persistedTimeRange.startTime),
                                endTime : new Date(me.persistedTimeRange.endTime)
                            }
                        }
                    } else {
                        filter = {
                            "timeRange" : {
                                startTime : new Date(start),
                                endTime : new Date(end)
                            }
                        }
                    }

                    //me.timeRangeIsRendering = true;
                    if(me.extras && me.extras.timeRange && me.extras.timeRange.startTime && me.extras.timeRange.endTime){
                        if(me.extras['aggregation-attributes']){
                            filter = {
                                "timeRange" : {
                                    "startTime" : new Date(me.extras.timeRange.startTime),
                                    "endTime" : new Date(me.extras.timeRange.endTime)
                                },
                                "filters" : me.extras.filters,
                                "aggregation" : me.extras['aggregation-attributes']
                            }
                        } else {
                            filter = {
                                "timeRange" : {
                                    "startTime" : new Date(me.extras.timeRange.startTime),
                                    "endTime" : new Date(me.extras.timeRange.endTime)
                                },
                                "filters" : me.extras.filters,
                            }
                        }
                    }
                    me.currentTimeRange = filter.timeRange;
                    //
                    me.updateTimeRangeDisplay();
                    //
                    me.summaryView = new SummaryView({
                        "activity":this.activity,
                        "eventCategory":me.eventCategory,
                        "filter":filter,
                        "onSummaryPageRendered": function(){
                            //
                            if(me.extras.filters || me.extras.timeRange){
                                me.tabContainerWidget.setActiveTab("detailview");
                            };
                            //
                        }
                    });
                    //
                    me.detailView = new DetailView({
                        "activity":this.activity,
                        "eventCategory":me.eventCategory,
                        "filter":filter,
                        "dontPersistAdvancedSearch": me.extras && me.extras.dontPersistAdvancedSearch
                    });
                    //
                    me.mapView = new MapView({
                        "activity":this.activity,
                        "eventCategory":me.eventCategory,
                        "filter":filter
                    });
                    //
                    me.tabs = [{
                                    id:"summaryview",
                                    name:"Summary View",
                                    content: this.summaryView
                                },{
                                    id:"detailview",
                                    name:"Detail View",
                                    content: this.detailView
                                }/*,{
                                    id:"mapview",
                                    name:"Map View",
                                    content: this.mapView
                                }*/];

                    //
                    me.actionEvents = {
                        tabClickEvent: "tabSelect"
                    };
                    me.bindTabEvents();
                    //
                    me.tabContainerWidget = new TabContainerWidget({
                        "container": me.containers.tabContainer,
                        "tabs": me.tabs,
                        "toggle": true,
                        actionEvents: this.actionEvents
                    }).build();
                    me.detailView.currentTimeRange = me.currentTimeRange;
                    //
                },
                //
                bindTabEvents: function () {
                    var me = this;
                    this.$el.off(this.actionEvents.tabClickEvent).on(this.actionEvents.tabClickEvent, function(e, obj){
                        var filter = {
                            timeRange : me.currentTimeRange
                        }; 
                        if(me.extras && me.extras.timeRange && me.extras.timeRange.startTime && me.extras.timeRange.endTime){
                            if(me.extras['aggregation-attributes']){
                                filter = {
                                    "timeRange" : {
                                        "startTime" : new Date(me.extras.timeRange.startTime),
                                        "endTime" : new Date(me.extras.timeRange.endTime)
                                    },
                                    "filters" : me.extras.filters,
                                    "aggregation" : me.extras['aggregation-attributes']
                                }
                            } else {
                                filter = {
                                    "timeRange" : {
                                        "startTime" : new Date(me.extras.timeRange.startTime),
                                        "endTime" : new Date(me.extras.timeRange.endTime)
                                    },
                                    "filters" : me.extras.filters,
                                }
                            }
                        }
                        if(obj.id === 0){
                            me.refreshSummaryView(filter);
                        } else if(obj.id === 1){
                            me.refreshDetailView(filter);    
                        }
                    });
                },
                //
                updateRefreshTime: function(){
                    var me=this;
                    me.containers.lastUpdatedDisplay.html('Last updated ' + Slipstream.SDK.DateFormatter.format(new Date(), "MM-DD-YYYY HH:mm:ss A"));
                },
                //
                validateECMSystemStatus: function(){
                    var me=this,
                        onSuccess,
                        onError;
                    //
                    onSuccess = function(response){
                        var statusCode = response['status-code'];
                        //
                        if(statusCode !== Constants.ECM_ERROR_CODES.ERROR_CODE_100){//some issue with ECM then
                            me.containers.systemStatusContainer.html(me.configs.getECMStatusDescription(statusCode))
                            me.containers.systemStatusContainer.show();
                        }else{
                            me.containers.systemStatusContainer.hide();
                        }
                        //
                    }
                    //
                    onError = function(){
                        console.log("Error in getting the ECM system status");
                    }
                    me.service.getECMSystemStatus(onSuccess, onError);
                },
                //
                getToolTipView: function(help){
                    var tooltipView  = TemplateRenderer(HelpTemplate,{
                        'help-content':help['content'],
                        'ua-help-text':help['ua-help-text'],
                        'ua-help-identifier':help['ua-help-identifier']
                    });
                    return $(tooltipView);
                },
                //
                addToolTipHelp: function(help){
                    var me=this;
                    new TooltipWidget({
                        "elements": {
                            "interactive": true,
                            "maxWidth": 300,
                            "minWidth": 300,
                            "position": "right"
                        },
                        "container": me.containers.mainContainer.find('.ev-title-help'),
                        "view": me.getToolTipView(help)
                    }).build();
                },
                //
                render: function () {
                    var me=this,
                        mimeType = this.activity.getIntent().data.hasOwnProperty('mime_type') ? this.activity.getIntent().data['mime_type'] : this.activity.getIntent().data,
                        extras = this.activity.getExtras(),//contains filter
                        heading = this.getHeadingAndHelpTextForMimeType(mimeType),
                        eventViewerHTML = TemplateRenderer(EventViewerTemplate, {
                            "heading": heading['title'],
                            "last-updated": "Last updated " + Slipstream.SDK.DateFormatter.format(new Date(), "MM-DD-YYYY HH:mm:ss A"),
                            "error_msg": "tst message"
                        });
                    me.$el.append(eventViewerHTML);
                    //
                    me.eventCategory = me.getEventCatForMimeType(mimeType);
                    //
                    me.extras = extras;
                    me.containers = {
                        "mainContainer": me.$el,
                        "timeSpanContainer": me.$el.find(".ev-time-span-selector"),
                        "tabContainer": me.$el.find(".ev-tab-container"),
                        "lastUpdatedDisplay": me.$el.find(".ev-last-updated span"),
                        "timeRangeDisplayContainer": me.$el.find(".ev-time-range-display"),
                        "systemStatusContainer": me.$el.find(".ev-ecm-status-error")
                    };
                    //
                    var pref = me.getPersistedConfig(),
                        linkId = -2;//default 30 min
                    if(pref && pref["selectedTime"]){
                        linkId = pref["selectedTime"]["linkId"];
                        me.$currentPredefinedTimeLinkTarget = me.containers.mainContainer.find("[data-linkid=" + linkId + "]");
                        if(linkId === 5){//CUSTOM
                            me.timeRangeDuration = pref["selectedTime"]["customTimeRange"];
                        };
                    }else{
                        me.$currentPredefinedTimeLinkTarget = me.containers.mainContainer.find(".ev-time-ranges-links-selected");// by default 30 min is selected
                    };
                    me.addToolTipHelp(heading['title-help']);
                    me.validateECMSystemStatus();
                    //
                    me.timeRangeIsRendering = true;
                    //
                    if(me.extras && me.extras.timeRange && me.extras.timeRange.startTime && me.extras.timeRange.endTime){
                        me.buildTimeRange({
                            "startTime": new Date(me.extras.timeRange.startTime),
                            "endTime": new Date(me.extras.timeRange.endTime)
                        });
                        //consider always CUSTOM when jumping
                        me.$currentPredefinedTimeLinkTarget = me.containers.mainContainer.find("[data-linkid=" + 5 + "]"); //5 for CUSTOM
                        //
                        me.toggleTimeRangeSelection(me.$currentPredefinedTimeLinkTarget[0]);
                    }else{
                        me.toggleTimeRangeSelection(me.$currentPredefinedTimeLinkTarget[0]);
                        var timeRangeObj={};
                        switch (linkId){
                            case -2:
                                timeRangeObj = me.getThirtyMinsTimeRange();
                                break;
                            case -1:
                                timeRangeObj = me.getOneHourTimeRange();
                                break;
                            case 0:
                                timeRangeObj = me.getTwoHoursTimeRange();
                                break;
                            case 1:
                                timeRangeObj = me.getFourHoursTimeRange();
                                break;
                            case 2:
                                timeRangeObj = me.getEightHoursTimeRange();
                                break;
                            case 3:
                                timeRangeObj = me.getSixteenHoursTimeRange();
                                break;
                            case 4:
                                timeRangeObj = me.getTwentyFourHoursTimeRange();
                                break;
                            case 5:
                                timeRangeObj = me.timeRangeDuration;
                                break;
                        };
                        me.persistedTimeRange = timeRangeObj;
                        me.buildTimeRange();
                    }
                    //
                    me.buildTabs();
                    //
                    return this;
                }

            });
        _.extend(EventViewer.View.prototype, PersistenceMixin);
        });
    return Slipstream.EventViewer;
});
