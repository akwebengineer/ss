/**
 *  Web Filtering Monitors View to display the Top monitors
 *
 *  @module WebFilteringMonitors [EventViewer]
 *  @author Shini <shinig@juniper.net>
 *  @copyright Juniper Networks, Inc. 2015
 * */

define(['backbone', 'lib/template_renderer/template_renderer', 'text!../templates/firewallMonitorsView.html',
        '../utils/monitorsManager.js'],
function( Backbone, render_template, MonitorsTemplate, MonitorsManager){

	var WebFilteringMonitors = Backbone.View.extend({
        initialize:function(options){
            console.log(options);
            this.category = options.category;
            this.startTime = options.startTime;
            this.endTime = options.endTime;
            this.render();
        },
        //
        render: function(){
            console.log('Web Filtering monitors view rendered');

            var me=this,
                filterObj = {
                    "category": me.category,
                    "startTime": me.startTime,
                    "endTime": me.endTime
                };
                monitorsManager = new MonitorsManager(filterObj),
                graphTitles = [],
                graphTitles.push({
                    'first-chart-title': "Top URLs blocked",
                    'second-chart-title': "Top Matched Profiles",
                    'third-chart-title': "Top Sources",
                    'fourth-chart-title': "Top Destinations"
                });
                graphObj = {'ev-monitors-views': graphTitles,
                            'last-updated-time': me.endTime
                           };
                webFilteringMonitorsHtml = render_template(MonitorsTemplate, graphObj);
            me.$el.append(webFilteringMonitorsHtml);
            me.containers = {
                "mainContainer": me.$el,
                "firstBarChartContainer": me.$el.find(".ev-first-bar-chart-view"),
                "secondBarChartContainer": me.$el.find(".ev-second-bar-chart-view"),
                "thirdBarChartContainer": me.$el.find(".ev-third-bar-chart-view"),
                "fourthBarChartContainer": me.$el.find(".ev-fourth-bar-chart-view")
            };

            // Displaying spinner widget
            monitorsManager.displaySpinner(me.containers.firstBarChartContainer[0], "Loading Top URLs Blocked Monitor...");
            monitorsManager.displaySpinner(me.containers.secondBarChartContainer[0], "Loading Top Matched Profiles Monitor...");
            monitorsManager.displaySpinner(me.containers.thirdBarChartContainer[0], "Loading Top Sources Monitor...");
            monitorsManager.displaySpinner(me.containers.fourthBarChartContainer[0], "Loading Top Destinations Monitor...");

            // Building Web Filtering - Top URLs blocked Monitor
            monitorsManager.buildTopURLsBlockedView(me.containers.firstBarChartContainer[0], me.category, me.startTime, me.endTime);
            // Building Web Filtering - Top Matched Profiles Monitor
            monitorsManager.buildTopMatchedProfilesView(me.containers.secondBarChartContainer[0]);
            // Building Web Filtering -  Top Sources Monitor
            monitorsManager.buildTopSourcesView(me.containers.thirdBarChartContainer[0]);
            // Building Web Filtering - Top Destinations Monitor
            monitorsManager.buildTopDestinationsView(me.containers.fourthBarChartContainer[0]);

            return this;
        }
        //

    });
    return WebFilteringMonitors;
});

