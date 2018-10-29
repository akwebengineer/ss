/**
 *  Summary View
 *  
 *  @module EventViewer.Summary
 *  @author dharma<adharmendran@juniper.net>
 *  @copyright Juniper Networks, Inc. 2015l
 * */
define(['jquery', 'backbone', 'marionette', './baseEventViewerView.js', './summaryInSightBarCompositeView.js', 
	'text!../templates/summaryViewTemplate.html', '../widgets/swimLaneWidget.js', 'lib/template_renderer/template_renderer',
	'./firewallMonitorsView.js', './webFilteringMonitorsView.js', './vpnMonitorsView.js', './contentFilteringMonitorsView.js', './antiSpamMonitorsView.js',
	'./antiVirusMonitorsView.js', './ipsMonitorsView.js','../utils/monitorsManager.js','../../../../ui-common/js/common/utils/SmUtil.js'
	], function($, Backbone, Marionette, BaseEventViewerView, SummaryCompositeView, SummaryViewTemplate, SwimLaneWidget, TemplateRenderer,
	FirewallMonitorsView, WebFilteringMonitors, VPNMonitorsView, ContentFilteringMonitorsView, AntiSpamMonitorsView, AntiVirusMonitorsView,
	IPSMonitorsView,MonitorsManager,SMUtil){
    
        SummaryView = BaseEventViewerView.extend({
            className: "ev-no-scroll",

            buildSummaryInSightBar:function(container){
                var me = this, list = me.configs.getSummaryInsightEventsList(), eventList = new Backbone.Collection([]), 
                len = list.list.length, j, requests = [], totalCount = 0, eventCount = 0,totalCounter = 0, eventCounter = 0,  reqData, val = 0;;
                //
                container.empty();
                var spinner = me.displaySpinner(container, me.context.getMessage("ev_summary_InSight_bar_loading"));
                //
                for(j = 0; j < len; j++){          
                    reqData = me.getInsightCountQuery(list.list[j].query);
                    requests.push($.ajax({
                        url : '/api/juniper/ecm/log-scoop/aggregate', 
                        type : 'POST',
                        data : JSON.stringify(reqData), 
                        contentType : "application/json"
                    }));
                }

                $.when.apply($, requests).done(function(){
                    $.each(arguments, function(i, data){
                        val=0;
                        if(data[2].responseJSON.response.result.length != 0){
                            val = data[2].responseJSON.response.result[0].value;
                        }
                        if(i == 0){
                            totalCount = val;
                            totalCounter = smUtil.roundOff(totalCount);
                        } else {
                            eventCount = val;
                            eventCounter = smUtil.roundOff(eventCount);
                            eventList.push({'eventtype' : list.list[i].eventtype, 'eventcount' : eventCounter,  'eventcountmsg' : eventCount,'query' : list.list[i].query}); 
                        }
                    });
                    //
                    var myModel = Backbone.Model.extend({
                        defaults : {
                            events : {
                                'totalevents': totalCounter
                            },
                            list: eventList
                        }
                    });
                    //
                    var summaryInSightBarCollectionView = new SummaryCompositeView({
                        model: new myModel()
                    });
                    //
                    me.destroySpinner(spinner);
                    container.empty();
                   
                    container.append(summaryInSightBarCollectionView.render().$el);

                    summaryInSightBarCollectionView.$el.find(".ev-event-total-events").on("mouseover", function(e){     
                           monitorsManager.renderTooltip(totalCount,$(e.target));         
                                
                        });
                    summaryInSightBarCollectionView.$el.find(".ev-horizontal-align-left-vertical-seperator").on("mouseover", function(e){    
                             monitorsManager.renderTooltip(eventList,$(e.currentTarget));
                              
                        });
                }); 
                //
                Slipstream.vent.off("evsummary:eventitemclick").on("evsummary:eventitemclick", function(inSightBarModel){
                    var mimeType = 'vnd.juniper.net.eventlogs.alleventcategories',
                        request = {
                        'timeRange': {
                            'startTime': me.currentTimeRange.startTime,
                            'endTime': me.currentTimeRange.endTime
                        },
                        'filters': {
                            "or" : inSightBarModel.get("query")
                        }
                    }
                    // start related activity for the clicked category
                    var intent = new Slipstream.SDK.Intent('slipstream.intent.action.ACTION_LIST', { 
                        mime_type: mimeType 
                    });
                    intent.putExtras(request);  // send the request obj containing startTime, endTime, filters
                    me.context.startActivity(intent);
                });
                //
            },
            //
            getInsightCountQuery: function(query){
                var me = this, start = me.currentTimeRange.startTime, end = me.currentTimeRange.endTime, postData,
                    reqTime = me.configs.getRequestFormatTimeString(start) + "/" + me.configs.getRequestFormatTimeString(end);
                
                if(query.length > 0){
                    postData = {  
                        "request":{  
                          "aggregation":"COUNT",
                          "aggregation-attributes":"none",
                          "time-interval":reqTime,
                          "size":"1",
                          "slots":"1",
                          "order":"ascending",
                          "filters": {
                              "or": query
                            }
                        }
                    };
                } else {
                    postData = {  
                       "request":{  
                          "aggregation":"COUNT",
                          "aggregation-attributes":"none",
                          "time-interval":reqTime,
                          "size":"1",
                          "slots":"1",
                          "order":"ascending"
                       }
                    };
                }
                return postData;
            },

            //returns the swimlane sample datas as per the category
            getSwimLaneDataForCategory: function(onSuccess){
                var me=this;
                switch(me.options.eventCategory){
                    case 'ALL EVENTS':
                        return this.service.getSwimLaneDataForAllCategories(me.options.eventCategory, me.configs.getRequestFormatTimeString(me.currentTimeRange.startTime), me.configs.getRequestFormatTimeString(me.currentTimeRange.endTime), onSuccess);
                        break;
                    default:
                        return this.service.getSwimLaneData(me.options.eventCategory, me.configs.getRequestFormatTimeString(me.currentTimeRange.startTime), me.configs.getRequestFormatTimeString(me.currentTimeRange.endTime), onSuccess);
                }
            },
            //
            renderSwimLane: function(){
                var me=this,
                    deferred = $.Deferred(),
                    spinner;
                me.containers.swimLaneContainer.empty();
                spinner = me.displaySpinner(me.containers.swimLaneContainer, me.context.getMessage("ev_summary_swimlane_loading"));
                //
                me.getSwimLaneDataForCategory(function(data, startTimeInISO, endTimeInISO){
                    //
                    me.destroySpinner(spinner);
                    me.containers.swimLaneContainer.empty();
                    var swimLaneWidget = new SwimLaneWidget({
                        "container": me.containers.swimLaneContainer[0],
                        "data": data,
                        "timeRange": {"startTime": new Date(startTimeInISO), "endTime": new Date(endTimeInISO)}
                    }).build();
                    //
                    me.listenTo(swimLaneWidget, "swimlanecategoryclick", function(eventCategory){
                        var mimeType = me.configs.getCategoryMimeType(eventCategory),
                            request = {
                            'timeRange': {
                                'startTime': me.currentTimeRange.startTime,
                                'endTime': me.currentTimeRange.endTime
                            }
                        };
                        // start related activity for the clicked category
                        var intent = new Slipstream.SDK.Intent('slipstream.intent.action.ACTION_LIST', { 
                            mime_type: mimeType 
                        });
                        intent.putExtras(request);  // send the request obj containing startTime, endTime
                        me.context.startActivity(intent);                        
                    })
                    //
                    deferred.resolve();
                });
                //
                return deferred.promise();
            },     
        
            updateTimeRangeDisplay: function(){
                var me=this;
                me.containers.timeRangeDisplayContainer.html(me.configs.getTimeRangeToDisplay(me.currentTimeRange));
            },

            refreshContentView: function(filterObj){
                var me=this;
                me.currentTimeRange = filterObj.filter.timeRange;
                this.$el.find(".ev-summary-graph-view").empty();
                this.renderMonitorsView(filterObj.filter);
                this.buildSummaryInSightBar(this.$el.find('.ev-insight-bar-container'));
                me.renderSwimLane();
                me.updateTimeRangeDisplay();
            },

            initialize: function(options){
                BaseEventViewerView.prototype.initialize.call(this, options);
            },
            
            render:function(){
                var me=this,
                    config = me.options,
                    summaryInSightBar,
                    summaryViewTemplate;
                //
                var filterObj = {
                    "category": me.options.eventCategory,
                    "startTime": me.options.filter.timeRange.startTime,
                    "endTime": me.options.filter.timeRange.endTime
                };
                monitorsManager = new MonitorsManager(filterObj);
                smUtil = new SMUtil();
                me.currentTimeRange = this.options.filter.timeRange;
                //me.options = config;
                summaryViewTemplate = TemplateRenderer(SummaryViewTemplate, {
                    "ev-summary-graph-views": config.eventCategory !== "ALL EVENTS",//show graph view only for specific category
                    "ev-insight-bar-views": config.eventCategory === "ALL EVENTS"//show insight bar only in case of ALL EVENTS
                });
                //
                this.$el.append(summaryViewTemplate);
                //
                me.containers = {
                    "mainContainer": this.$el,
                    "inSightBarContainer": this.$el.find(".ev-insight-bar-container"),
                    "swimLaneContainer": this.$el.find(".ev-swim-lane-container"),
                    "timeRangeDisplayContainer": me.$el.find(".ev-time-range-display")
                };
                
                //
                if(config.eventCategory === "ALL EVENTS"){//only for All events display the insight info
                    me.buildSummaryInSightBar(me.containers.inSightBarContainer);
                    me.$el.find(".ev-swim-lane-container").css("margin", "15px 0px 10px 0px")//bad code but what to do...
                }else{
                    me.$el.find(".ev-swim-lane-container").css("margin", "0px 0px 10px 0px")//bad code but what to do...
                }
                //make a deferred call for swimlane
                $.when(this.renderSwimLane()).done(function(){
                    me.options.onSummaryPageRendered && me.options.onSummaryPageRendered();
                });
                //
                this.renderMonitorsView(config.filter)
                this.updateTimeRangeDisplay();                
                return me;
            },

            renderMonitorsView: function(filter) {
                var me=this,
                    graphViewContainer = me.containers.mainContainer.find(".ev-summary-graph-view"),
                    startTime = filter.timeRange.startTime,
                    endTime = filter.timeRange.endTime,
                    monitorOptions= {
                        activity: me.options.activity,
                        "el":graphViewContainer,
                        "category": me.options.eventCategory,
                        "startTime": startTime,
                        "endTime": endTime
                    };
                switch(me.options.eventCategory){
                    case 'FIREWALL':
                        this.firewallMonitorsView = new FirewallMonitorsView(monitorOptions);
                        break;
                    case "WEB-FILTERING":
                        this.webFilteringMonitorsView = new WebFilteringMonitors(monitorOptions);
                        break;
                    case "VPN":
                        this.vpnMonitorsView = new VPNMonitorsView(monitorOptions);
                        break;
                    case "CONTENT-FILTERING":
                        this.contentFilteringMonitorsView = new ContentFilteringMonitorsView(monitorOptions) ;
                        break;
                    case "ANTI-SPAM":
                        this.antiSpamMonitorsView = new AntiSpamMonitorsView(monitorOptions);
                        break;
                    case "ANTI-VIRUS":
                        this.antiVirusMonitorsView = new AntiVirusMonitorsView(monitorOptions);
                        break;
                    case "IPS":
                        this.ipsMonitorsView = new IPSMonitorsView(monitorOptions);
                        break;
                }
            }
        });
    return SummaryView;

})