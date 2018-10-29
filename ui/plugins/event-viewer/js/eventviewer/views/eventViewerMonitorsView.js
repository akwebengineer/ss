/**
 * Event Viewer Monitors Graph View
 *
 * @module EventViewerMonitorsView
 * @author Shini <shinig@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
*/
define(['backbone', '../widgets/genericBarChartWidget.js', './monitorsGraphViewService.js'],
function( Backbone, GenericBarChartWidget, MonitorsService){

	var EventViewerMonitorsView = Backbone.View.extend({
        initialize:function(options){
            console.log(options);
        },
        //
        render: function(){
            var me=this;
            service = new MonitorsService();
            return this;
        },
        //

        parseCollection: function(collection) {
            var config = {                  // Config for Bar Chart
               yAxisTitle: 'Count'
            };
            config.categories=[];
            config.data=[];
            config.tooltip=[];

            collection.each(function(model){
                config.categories.push(model.get("key"));
                config.data.push(model.get("value"));
                config.tooltip.push(model.get("key"));
            });
            return config;
        },
        // Building Top Sources Monitor
        buildTopSourcesView: function(el, category){
            var me = this,
                onSuccess,
                onError,
                startTime = 0, endTime = 0,
                aggregation = "source-address",
                defaultData = service.getDefaultData(aggregation, category, startTime, endTime),
                jsonData = JSON.stringify(defaultData);
                console.log(jsonData);
            //
            onSuccess = function(collection, response, options){
                config = me.parseCollection(collection);
                //
                me.topSourcesView = new GenericBarChartWidget({
                    "el": el,
                    "chartConfig": config
                });
            };
            //
            onError = function(collection, response, options){
                console.log("Top Sources monitor view collection failed");
            };
            //
           service.getTopMonitors(onSuccess, onError, jsonData);
        },

        // Building Top Destinations Monitor
        buildTopDestinationsView: function(el, category){
            var me=this,
                onSuccess,
                onError,
                startTime = 0, endTime = 0,
                aggregation = "destination-address",
                defaultData = service.getDefaultData(aggregation, category, startTime, endTime),
                jsonData = JSON.stringify(defaultData);
            //
            onSuccess = function(collection, response, options){
                config = me.parseCollection(collection);
                //
                me.topDestinationsView = new GenericBarChartWidget({
                    "el": el,
                    "chartConfig": config
                });
            };
            //
            onError = function(collection, response, options){
                console.log("Top Destinations monitor view collection failed");
            };
            //
           service.getTopMonitors(onSuccess, onError, jsonData);
        },

        // Building Top Users Monitor
        buildTopUsersView: function(el, category){
            var me=this,
                onSuccess,
                onError,
                startTime = 0, endTime = 0,
                aggregation = "username",
                defaultData = service.getDefaultData(aggregation, category, startTime, endTime),
                jsonData = JSON.stringify(defaultData);
            //
            onSuccess = function(collection, response, options){
                config = me.parseCollection(collection);
                //
                me.topUsersView = new GenericBarChartWidget({
                    "el": el,
                    "chartConfig": config
                });
            };
            //
            onError = function(collection, response, options){
                console.log("Top Users monitor view collection failed");
            };
            //
           service.getTopMonitors(onSuccess, onError, jsonData);
        },

        // Building Top Reporting Devices
        buildTopDevicesView: function(el, category){
            var me=this,
                onSuccess,
                onError,
                startTime = 0, endTime = 0,
                aggregation = "host",
                defaultData = service.getDefaultData(aggregation, category, startTime, endTime),
                jsonData = JSON.stringify(defaultData);
            //
            onSuccess = function(collection, response, options){
                config = me.parseCollection(collection);
                //
                me.topDevicesView = new GenericBarChartWidget({
                    "el": el,
                    "chartConfig": config
                });
            };
            //
            onError = function(collection, response, options){
                console.log("Top Reporting Devices monitor view collection failed");
            };
            //
           service.getTopMonitors(onSuccess, onError, jsonData);
        },

         // Building Top URLs blocked Monitor
        buildTopURLsBlockedView: function(el, category){
            var me = this,
                onSuccess,
                onError,
                startTime = 0, endTime = 0,
                aggregation = "url",
                defaultData = service.getDefaultData(aggregation, category, startTime, endTime),
                jsonData = JSON.stringify(defaultData);
                console.log(jsonData);
            //
            onSuccess = function(collection, response, options){
                config = me.parseCollection(collection);
                //
                me.topUrlsBlockedView = new GenericBarChartWidget({
                    "el": el,
                    "chartConfig": config
                });
            };
            //
            onError = function(collection, response, options){
                console.log("Top  URLs blocked monitor view collection failed");
            };
            //
           service.getTopMonitors(onSuccess, onError, jsonData);
        },

        // Building Top Matched Profiles Monitor
        buildTopMatchedProfilesView: function(el, category){
          var me=this,
              onSuccess,
              onError,
              startTime = 0, endTime = 0,
              aggregation = "profile-name",
              defaultData = service.getDefaultData(aggregation, category, startTime, endTime),
              jsonData = JSON.stringify(defaultData);
          //
          onSuccess = function(collection, response, options){
              config = me.parseCollection(collection);
              //
              me.topMatchedProfilesView = new GenericBarChartWidget({
                  "el": el,
                  "chartConfig": config
              });
          };
          //
          onError = function(collection, response, options){
              console.log("Top Matched Profiles monitor view collection failed");
          };
          //
         service.getTopMonitors(onSuccess, onError, jsonData);
        },

        // Building Top Blocked Protocol commands monitor
        buildTopBlockedCmdsView: function(el, category){
            var me = this,
                onSuccess,
                onError,
                startTime = 0, endTime = 0,
                aggregation = "",
                defaultData = service.getDefaultData(aggregation, category, startTime, endTime),
                jsonData = JSON.stringify(defaultData);
                console.log(jsonData);

           onSuccess = function(collection, response, options){
                config = me.parseCollection(collection);
                //
                me.topBlockedCmdsView = new GenericBarChartWidget({
                    "el": el,
                    "chartConfig": config
                });
            };
            //
            onError = function(collection, response, options){
                console.log("Top Blocked Protocol Commands monitor view collection failed");
            };
            //
           service.getTopMonitors(onSuccess, onError, jsonData);
        },

        // Building Top Reasons Monitor
        buildTopReasonsView: function(el, category){
            var me=this,
                service = new MonitorsService(),
                onSuccess,
                onError,
                startTime = 0, endTime = 0,
                aggregation = "",
                defaultData = service.getDefaultData(aggregation, category, startTime, endTime),
                jsonData = JSON.stringify(defaultData);

           onSuccess = function(collection, response, options){
                config = me.parseCollection(collection);
                //
                me.topReasonsView = new GenericBarChartWidget({
                    "el": el,
                    "chartConfig": config
                });
            };
            //
            onError = function(collection, response, options){
                console.log("Top Reasons monitor view collection failed");
            };
            //
           service.getTopMonitors(onSuccess, onError, jsonData);
        },

        // Building Top Spam Detected Monitor
        buildTopSpamDetectedView: function(el, category){
        var me = this,
            onSuccess,
            onError,
            startTime = 0, endTime = 0,
            aggregation = "",
            defaultData = service.getDefaultData(aggregation, category, startTime, endTime),
            jsonData = JSON.stringify(defaultData);
            console.log(jsonData);

        onSuccess = function(collection, response, options){
            config = me.parseCollection(collection);
            //
            me.topSpamDetectedView = new GenericBarChartWidget({
                "el": el,
                "chartConfig": config
            });
        };
        //
        onError = function(collection, response, options){
            console.log("Top Spam Detected monitor view collection failed");
        };
        //
        service.getTopMonitors(onSuccess, onError, jsonData);
        },

        // Building Top Domain Names Rejected Monitor
        buildTopDomainsRejectedView: function(el, category){
            var me=this,
                service = new MonitorsService(),
                onSuccess,
                onError,
                startTime = 0, endTime = 0,
                aggregation = "",
                defaultData = service.getDefaultData(aggregation, category, startTime, endTime),
                jsonData = JSON.stringify(defaultData);

           onSuccess = function(collection, response, options){
                config = me.parseCollection(collection);
                //
                me.topDomainsRejectedView = new GenericBarChartWidget({
                    "el": el,
                    "chartConfig": config
                });
            };
            //
            onError = function(collection, response, options){
                console.log("Top Domain Names Rejected monitor view collection failed");
            };
            //
           service.getTopMonitors(onSuccess, onError, jsonData);
        },

        // Building Top Reporting/Attacked Devices Monitor
        buildTopAttackedDevicesView: function(el, category){
            var me=this,
                service = new MonitorsService(),
                onSuccess,
                onError,
                startTime = 0, endTime = 0,
                aggregation = "",
                defaultData = service.getDefaultData(aggregation, category, startTime, endTime),
                jsonData = JSON.stringify(defaultData);

           onSuccess = function(collection, response, options){
                config = me.parseCollection(collection);
                //
                me.topAttackedDevicesView = new GenericBarChartWidget({
                    "el": el,
                    "chartConfig": config
                });
            };
            //
            onError = function(collection, response, options){
                console.log("Top Attacked Devices monitor view collection failed");
            };
            //
           service.getTopMonitors(onSuccess, onError, jsonData);
        },

        // Building Top Viruses Monitors
        buildTopVirusesView: function(el, category){
            var me=this,
                service = new MonitorsService(),
                onSuccess,
                onError,
                startTime = 0, endTime = 0,
                aggregation = "name",
                defaultData = service.getDefaultData(aggregation, category, startTime, endTime),
                jsonData = JSON.stringify(defaultData);

           onSuccess = function(collection, response, options){
                config = me.parseCollection(collection);
                //
                me.topVirusesView = new GenericBarChartWidget({
                    "el": el,
                    "chartConfig": config
                });
           };
           //
           onError = function(collection, response, options){
                console.log("Top Viruses monitor view collection failed");
           };
            //
           service.getTopMonitors(onSuccess, onError, jsonData);
        },

        // Building Top Categories Monitors
        buildTopCategoriesView: function(el, category){
            var me=this,
                service = new MonitorsService(),
                onSuccess,
                onError,
                startTime = 0, endTime = 0,
                aggregation = "category",
                defaultData = service.getDefaultData(aggregation, category, startTime, endTime),
                jsonData = JSON.stringify(defaultData);

           onSuccess = function(collection, response, options){
                config = me.parseCollection(collection);
                //
                me.topDevicesView = new GenericBarChartWidget({
                    "el": el,
                    "chartConfig": config
                });
            };
            //
            onError = function(collection, response, options){
                console.log("Top Categories monitor view collection failed");
            };
            //
           service.getTopMonitors(onSuccess, onError, jsonData);
        },

        // Building Top Source Countries Devices
        buildTopSourceCountriesView: function(el, category){
            var me=this,
                service = new MonitorsService(),
                onSuccess,
                onError,
                startTime = 0, endTime = 0,
                aggregation = "src-country-name",
                defaultData = service.getDefaultData(aggregation, category, startTime, endTime),
                jsonData = JSON.stringify(defaultData);

           onSuccess = function(collection, response, options){
                config = me.parseCollection(collection);
                //
                me.topSourceCountriesView = new GenericBarChartWidget({
                    "el": el,
                    "chartConfig": config
                });
            };
            //
            onError = function(collection, response, options){
                console.log("Top Source Countries monitor view collection failed");
            };
            //
           service.getTopMonitors(onSuccess, onError, jsonData);
        },

        // Building Top Destination Countries Devices
        buildTopDestinationCountriesView: function(el, category){
            var me=this,
                service = new MonitorsService(),
                onSuccess,
                onError,
                startTime = 0, endTime = 0,
                aggregation = "dst-country-name",
                defaultData = service.getDefaultData(aggregation, category, startTime, endTime),
                jsonData = JSON.stringify(defaultData);

           onSuccess = function(collection, response, options){
                config = me.parseCollection(collection);
                //
                me.topDestinationCountriesView = new GenericBarChartWidget({
                    "el": el,
                    "chartConfig": config
                });
            };
            //
            onError = function(collection, response, options){
                console.log("Top Destination Countries monitor view collection failed");
            };
            //
           service.getTopMonitors(onSuccess, onError, jsonData);
        },

        // Building IPS - Top IPS Attacks Monitors
        buildTopIPSAttacksView: function(el, category){
            var me=this,
                onSuccess,
                onError,
                startTime = 0, endTime = 0,
                aggregation = "attack-name",
                defaultData = service.getDefaultData(aggregation, category, startTime, endTime),
                jsonData = JSON.stringify(defaultData);

           onSuccess = function(collection, response, options){
                config = me.parseCollection(collection);
                //
                me.topVirusesView = new GenericBarChartWidget({
                    "el": el,
                    "chartConfig": config
                });
           };
           //
           onError = function(collection, response, options){
                console.log("Top Viruses monitor view collection failed");
           };
            //
           service.getTopMonitors(onSuccess, onError, jsonData);
        }
    });
    return EventViewerMonitorsView;
});

