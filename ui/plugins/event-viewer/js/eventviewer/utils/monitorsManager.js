/**
 * Event Viewer Monitors Graph View
 *
 * @module EventViewerMonitorsView
 * @author Shini <shinig@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
*/
define(['backbone', '../widgets/genericBarChartWidget.js', '../service/eventViewerService.js', '../conf/configs.js',
        'widgets/spinner/spinnerWidget', 'lib/template_renderer/template_renderer', 
        'widgets/donutChart/donutChartWidget', "../../../../ui-common/js/common/utils/filterUtil.js","widgets/tooltip/tooltipWidget"],
function( Backbone, GenericBarChartWidget, MonitorsService, Configs, SpinnerWidget, template_renderer, DonutChartWidget, FilterUtil,TooltipWidget){

	var MonitorsManager = function(filterObj){
        var me=this;
        me.configs = new Configs();
        me.filterUtil = new FilterUtil();
        me.service = new MonitorsService({
            "configs": me.configs
        });
        me.filter = {
            "category": filterObj.category,
            "startTime": filterObj.startTime,
            "endTime": filterObj.endTime
        };
        //
        // Builds the spinner and returns it. Use the returned spinner to destroy() it later
        me.displaySpinner = function(container, message){
            var spinner = new SpinnerWidget({
                "container": container,
                "statusText": message
            }).build();
            return spinner;
        };
        //
        me.destroySpinner = function(spinner){
            spinner.destroy();
        };
        // Bar chart configuration setting
        me.parseCollection = function(collection, el) {
            var config = {
               yAxisTitle: 'Event Count',
               maxLabelSize: 18
            };
            config.categories=[];
            config.data=[];
            config.tooltip=[];

            if(collection.length === 0) {
                //me.displayNoData(el);
                $(el).html('<div class="monitors-no-data"><img style="width:35px; height:35px" src="/assets/images/dashboard/icon_minor_alert.svg"><span>No Data Available</span></div>');
            } else {
                collection.each(function(model){
                    config.categories.push(model.get("key"));
                    config.data.push(model.get("value"));
                    config.tooltip.push(model.get("value"));
                });
            }
            return config;
        };

        // Building Top Sources Monitor
        me.buildTopSourcesView = function(el){
            var onSuccess,
                onError,
                defaultData = $.extend({}, me.filter, {"aggregation": me.filterUtil.LC_KEY.SOURCE_ADDRESS});
            //
            onSuccess = function(collection, response, options){
                config = me.parseCollection(collection, el);
                //
                if(collection.length > 0){
                    me.topSourcesView = new GenericBarChartWidget({
                        "el": el,
                        "chartConfig": config
                    });
                }
            };
            //
            onError = function(collection, response, options){
                console.log("Top Sources monitor view collection failed");
            };
            //
           me.service.getTopMonitors(onSuccess, onError, defaultData);
        };

        // Building Top Destinations Monitor
        me.buildTopDestinationsView = function(el){
            var onSuccess,
                onError,
                defaultData = $.extend({}, me.filter, {"aggregation": me.filterUtil.LC_KEY.DESTINATION_ADDRESS});
            //
            onSuccess = function(collection, response, options){
                config = me.parseCollection(collection, el);
                //
                if(collection.length > 0){
                    me.topDestinationsView = new GenericBarChartWidget({
                        "el": el,
                        "chartConfig": config
                    });
                }
            };
            //
            onError = function(collection, response, options){
                console.log("Top Destinations monitor view collection failed");
            };
            //
           me.service.getTopMonitors(onSuccess, onError, defaultData);
        };

        // Building Top Users Monitor
        me.buildTopUsersView = function(el){
            var onSuccess,
                onError,
                defaultData = $.extend({}, me.filter, {"aggregation": me.filterUtil.LC_KEY.USER_NAME});
            //
            onSuccess = function(collection, response, options){
                config = me.parseCollection(collection, el);
                //
                if(collection.length > 0){
                    me.topUsersView = new GenericBarChartWidget({
                        "el": el,
                        "chartConfig": config
                    });
                }
            };
            //
            onError = function(collection, response, options){
                console.log("Top Users monitor view collection failed");
            };
            //
           me.service.getTopMonitors(onSuccess, onError, defaultData);
        };

        // Building Top Reporting Devices
        me.buildTopDevicesView = function(el){
            var onSuccess,
                onError,
                defaultData = $.extend({}, me.filter, {"aggregation": me.filterUtil.LC_KEY.HOST});
            //
            onSuccess = function(collection, response, options){
                config = me.parseCollection(collection, el);
                //
                if(collection.length > 0){
                    me.topDevicesView = new GenericBarChartWidget({
                        "el": el,
                        "chartConfig": config
                    });
                }
            };
            //
            onError = function(collection, response, options){
                console.log("Top Reporting Devices monitor view collection failed");
            };
            //
           me.service.getTopMonitors(onSuccess, onError, defaultData);
        };

        me.renderTooltip = function(eventCount,tooltipContainer){
               var eventCountMsg,i; 
                if(eventCount.models != undefined){
                    for (i = 0 ; i<=eventCount.models.length;i++){
                        if (eventCount.models[i].attributes.eventtype === tooltipContainer[0].children[0].innerHTML){
                            eventCountMsg = eventCount.models[i].attributes.eventcountmsg;
                            break;
                        }
                    }                    
                }
                else{
                    eventCountMsg = eventCount;
                }
                 var configurationSample = {
                    "position" : 'bottom',
                    "style" : 'bottomNavigation'
                },
                finalTooltipMsg = '<span>' + eventCountMsg  + '</span>';

                new TooltipWidget({
                    "elements": configurationSample,
                    "container": tooltipContainer,
                    "view": finalTooltipMsg
                }).build(); 
               
            };
       

         // Building Top URLs blocked Monitor
        me.buildTopURLsBlockedView = function(el, category, startTime, endTime){
            var onSuccess,
                onError,
                aggregation = me.filterUtil.LC_KEY.URL,
                startTime =  me.configs.getRequestFormatTimeString(startTime),
                endTime =  me.configs.getRequestFormatTimeString(endTime),
                defaultData = {
                    "request":{
                        "aggregation":"COUNT",
                        "aggregation-attributes":aggregation,
                        "time-interval": me.configs.getRequestFormatTimeString(startTime) + "/" + me.configs.getRequestFormatTimeString(endTime),
                        "size":"5",
                        "order":"ascending",
                        "filters": {
                            "and": [
                            {
                                "filter": {
                                    "key": me.filterUtil.LC_KEY.EVENT_TYPE,
                                    "operator": "EQUALS",
                                    "value": "WEBFILTER_URL_BLOCKED"
                                }
                            },
                            {
                                "filter": {
                                    "key": me.filterUtil.LC_KEY.EVENT_CATEGORY,
                                    "operator": "EQUALS",
                                    "value": me.configs.getCategoryFilterString(category)
                                }
                            }
                            ]
                        }
                    }
                };
            console.log(defaultData);
            //
            onSuccess = function(collection, response, options){
                config = me.parseCollection(collection, el);
                //
                if(collection.length > 0){
                    me.topUrlsBlockedView = new GenericBarChartWidget({
                        "el": el,
                        "chartConfig": config
                    });
                }
            };
            //
            onError = function(collection, response, options){
                console.log("Top URLs blocked monitor view collection failed");
            };
            //
            me.service.getTopURLsBlocked(onSuccess, onError, defaultData);
        };

        // Building Top Matched Profiles Monitor
        me.buildTopMatchedProfilesView = function(el){
          var onSuccess,
              onError,
              defaultData = $.extend({}, me.filter, {"aggregation": me.filterUtil.LC_KEY.PROFILE_NAME});
          //
          onSuccess = function(collection, response, options){
              config = me.parseCollection(collection, el);
              //
              if(collection.length > 0){
                  me.topMatchedProfilesView = new GenericBarChartWidget({
                      "el": el,
                      "chartConfig": config
                  });
              }
          };
          //
          onError = function(collection, response, options){
              console.log("Top Matched Profiles monitor view collection failed");
          };
          //
         me.service.getTopMonitors(onSuccess, onError, defaultData);
        };

        // Building Top Blocked Protocol commands monitor
        me.buildTopBlockedCmdsView = function(el, category, startTime, endTime){
            var onSuccess,
                onError,
                aggregation = "argument",
                startTime =  me.configs.getRequestFormatTimeString(startTime),
                endTime =  me.configs.getRequestFormatTimeString(endTime),
                defaultData = {
                    "request":{
                        "aggregation":"COUNT",
                        "aggregation-attributes":aggregation,
                        "time-interval": me.configs.getRequestFormatTimeString(startTime) + "/" + me.configs.getRequestFormatTimeString(endTime),
                        "size":"5",
                        "order":"ascending",
                        "filters": {
                            "and": [
                            {
                                "filter": {
                                    "key": me.filterUtil.LC_KEY.EVENT_TYPE,
                                    "operator": "EQUALS",
                                    "value": ["CONTENT_FILTERING_BLOCKED_MT", "CONTENT_FILTERING_BLOCKED_MT_LS"]
                                }
                            },
                            {
                                "filter": {
                                    "key": me.filterUtil.LC_KEY.EVENT_CATEGORY,
                                    "operator": "EQUALS",
                                    "value": me.configs.getCategoryFilterString(category)
                                }
                            }
                            ]
                        }
                    }
                };
            console.log(defaultData);

            //
            onSuccess = function(collection, response, options){
                config = me.parseCollection(collection, el);
                //
                if(collection.length > 0){
                    me.topUrlsBlockedView = new GenericBarChartWidget({
                        "el": el,
                        "chartConfig": config
                    });
                }
                //
            };
            //
            onError = function(collection, response, options){
                console.log("Top Blocked Protocol Commands monitor view collection failed");
            };
            //
            me.service.getTopURLsBlocked(onSuccess, onError, defaultData);

        };

        // Building Top Reasons Monitor
        me.buildTopReasonsView = function(el){
            var onSuccess,
                onError,
                defaultData = $.extend({}, me.filter, {"aggregation": me.filterUtil.LC_KEY.REASON});

           onSuccess = function(collection, response, options){
                config = me.parseCollection(collection, el);
                //
                if(collection.length > 0){
                    me.topReasonsView = new GenericBarChartWidget({
                        "el": el,
                        "chartConfig": config
                    });
                }
            };
            //
            onError = function(collection, response, options){
                console.log("Top Reasons monitor view collection failed");
            };
            //
           me.service.getTopMonitors(onSuccess, onError, defaultData);
        };

        // Building Top Spam Detected Monitor
        me.buildTopSpamDetectedView = function(el){
            var onSuccess,
                onError,
                defaultData = $.extend({}, me.filter, {"aggregation": ""});

            onSuccess = function(collection, response, options){
                config = me.parseCollection(collection, el);
                //
                if(collection.length > 0){
                    me.topSpamDetectedView = new GenericBarChartWidget({
                        "el": el,
                        "chartConfig": config
                    });
                }
            };
            //
            onError = function(collection, response, options){
                console.log("Top Spam Detected monitor view collection failed");
            };
            //
            me.service.getTopMonitors(onSuccess, onError, defaultData);
        };

        // Building Top Domain Names Rejected Monitor
        me.buildTopDomainsRejectedView = function(el){
            var onSuccess,
                onError,
                defaultData = $.extend({}, me.filter, {"aggregation": ""});

           onSuccess = function(collection, response, options){
                config = me.parseCollection(collection, el);
                //
                if(collection.length > 0){
                    me.topDomainsRejectedView = new GenericBarChartWidget({
                        "el": el,
                        "chartConfig": config
                    });
                }
            };
            //
            onError = function(collection, response, options){
                console.log("Top Domain Names Rejected monitor view collection failed");
            };
            //
           me.service.getTopMonitors(onSuccess, onError, defaultData);
        };

        // Building Top Reporting/Attacked Devices Monitor
        me.buildTopAttackedDevicesView = function(el){
            var onSuccess,
                onError,
                defaultData = $.extend({}, me.filter, {"aggregation": me.filterUtil.LC_KEY.HOST});

           onSuccess = function(collection, response, options){
                config = me.parseCollection(collection, el);
                //
                if(collection.length > 0){
                    me.topAttackedDevicesView = new GenericBarChartWidget({
                        "el": el,
                        "chartConfig": config
                    });
                }
            };
            //
            onError = function(collection, response, options){
                console.log("Top Attacked Devices monitor view collection failed");
            };
            //
           me.service.getTopMonitors(onSuccess, onError, defaultData);
        };

        // Building Top Viruses Monitors
        me.buildTopVirusesView = function(el){
            var onSuccess,
                onError,
                defaultData = $.extend({}, me.filter, {"aggregation": me.filterUtil.LC_KEY.NAME});

           onSuccess = function(collection, response, options){
                config = me.parseCollection(collection, el);
                //
                if(collection.length > 0){
                    me.topVirusesView = new GenericBarChartWidget({
                        "el": el,
                        "chartConfig": config
                    });
                }
           };
           //
           onError = function(collection, response, options){
                console.log("Top Viruses monitor view collection failed");
           };
            //
           me.service.getTopMonitors(onSuccess, onError, defaultData);
        };

        // Building Top Categories Monitors
        me.buildTopCategoriesView = function(el){
            var onSuccess,
                onError,
                defaultData = $.extend({}, me.filter, {"aggregation": me.filterUtil.LC_KEY.EVENT_CATEGORY});

           onSuccess = function(collection, response, options){
                config = me.parseCollection(collection, el);
                //
                if(collection.length > 0){
                    me.topDevicesView = new GenericBarChartWidget({
                        "el": el,
                        "chartConfig": config
                    });                    
                };
                //
            };
            //
            onError = function(collection, response, options){
                console.log("Top Categories monitor view collection failed");
            };
            //
           me.service.getTopMonitors(onSuccess, onError, defaultData);
        };

        // Building Top Source Countries Devices
        me.buildTopSourceCountriesView = function(el){
            var onSuccess,
                onError,
                defaultData = $.extend({}, me.filter, {"aggregation": "src-country-name"});

           onSuccess = function(collection, response, options){
                config = me.parseCollection(collection, el);
                //
                if(collection.length > 0){
                    me.topSourceCountriesView = new GenericBarChartWidget({
                        "el": el,
                        "chartConfig": config
                    });
                };
            };
            //
            onError = function(collection, response, options){
                console.log("Top Source Countries monitor view collection failed");
            };
            //
           me.service.getTopMonitors(onSuccess, onError, defaultData);
        };

        // Building Top Destination Countries Devices
        me.buildTopDestinationCountriesView = function(el){
            var onSuccess,
                onError,
                defaultData = $.extend({}, me.filter, {"aggregation": "dst-country-name"});

           onSuccess = function(collection, response, options){
                config = me.parseCollection(collection, el);
                //
                if(collection.length > 0){
                    me.topDestinationCountriesView = new GenericBarChartWidget({
                        "el": el,
                        "chartConfig": config
                    });
                };
            };
            //
            onError = function(collection, response, options){
                console.log("Top Destination Countries monitor view collection failed");
            };
            //
           me.service.getTopMonitors(onSuccess, onError, defaultData);
        };

        // Building IPS - Top IPS Attacks Monitors
        me.buildTopIPSAttacksView = function(el){
            var onSuccess,
                onError,
                defaultData = $.extend({}, me.filter, {"aggregation": me.filterUtil.LC_KEY.ATTACK_NAME});

           onSuccess = function(collection, response, options){
                config = me.parseCollection(collection, el);
                //
                if(collection.length > 0){
                    me.topVirusesView = new GenericBarChartWidget({
                        "el": el,
                        "chartConfig": config
                    });                    
                };
           };
           //
           onError = function(collection, response, options){
                console.log("Top Viruses monitor view collection failed");
           };
            //
           me.service.getTopMonitors(onSuccess, onError, defaultData);
        };

        // Building IPS - IPS severities Donut Chart
        me.buildIPSSeveritiesView = function(el, category, startTime, endTime){
            var onSuccess,
                onError,
                defaultData = {
                    "request": {
                        "aggregation": "COUNT",
                        "aggregation-attributes": me.filterUtil.LC_KEY.THREAT_SEVERITY,
                        "time-interval": me.configs.getRequestFormatTimeString(startTime) + "/" + me.configs.getRequestFormatTimeString(endTime),
                        "size": "5",
                        "order": "ascending",
                        "filters": {
                            "and": [
                                {
                                    "filter": {
                                        "key": me.filterUtil.LC_KEY.EVENT_TYPE,
                                        "operator": "EQUALS",
                                        "value": ["IDP_ATTACK_LOG_EVENT", "IDP_ATTACK_LOG_EVENT_LS"]
                                    }
                                },
                                {
                                    "filter": {
                                        "key": me.filterUtil.LC_KEY.EVENT_CATEGORY,
                                        "operator": "EQUALS",
                                        "value": me.configs.getCategoryFilterString(category)
                                    }
                                }
                            ]
                        }
                    }
                };

            onSuccess = function(collection, response, options){
                if(collection.length === 0) {
                    el.innerHTML = '<div class="monitors-no-data"><img style="width:35px; height:35px" src="/assets/images/dashboard/icon_minor_alert.svg"><span>No Data Available</span></div>';
                } else {
                    var mainData=[],
                        colorsArray=[],
                        colorsMap = me.configs.getIPSSeveritiesColorCodes();
                    //set the rank based on the severity
                    collection.each(function(model){
                        if(model.get("key").toUpperCase() === "CRITICAL"){
                            model.set("rank", 1);
                        }else if(model.get("key").toUpperCase() === "HIGH"){
                            model.set("rank", 2);
                        }else if(model.get("key").toUpperCase() === "MEDIUM"){
                            model.set("rank", 3);
                        }else if(model.get("key").toUpperCase() === "INFO"){
                            model.set("rank", 4);
                        }else if(model.get("key").toUpperCase() === "LOW"){
                            model.set("rank", 5);
                        }
                    });
                    //
                    collection.sort();
                    //
                    collection.each(function(model){
                        var data=[];
                        data.push(model.get("key"));
                        data.push(model.get("value"));
                        colorsArray.push(colorsMap[model.get("key").toUpperCase()])
                        mainData.push(data);
                    });

                    var options = {
                        donut: {
                            name: "IPS severities",
                            data: mainData,
                            showInLegend: true
                        },
                        "colors": colorsArray
                    };
                    var conf = {
                         container: el,
                         options: options
                    };
                    var donutChartWidgetObj = new DonutChartWidget(conf);
                        donutChartWidgetObj.build();
                }

            };
           //
           onError = function(collection, response, options){
                console.log("IPS severity chart view collection failed");
           };
            //
           me.service.getTopURLsBlocked(onSuccess, onError, defaultData);
        };
    };
    return MonitorsManager;
});
