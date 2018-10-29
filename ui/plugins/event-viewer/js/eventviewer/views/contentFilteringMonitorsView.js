/**
 *  Content Filtering Monitors View to display the Top monitors
 *
 *  @module ContentFilteringMonitors [EventViewer]
 *  @author Shini <shinig@juniper.net>
 *  @copyright Juniper Networks, Inc. 2015
 * */

define(['backbone', 'lib/template_renderer/template_renderer', 'text!../templates/firewallMonitorsView.html',
	    '../utils/monitorsManager.js'],
function( Backbone, render_template, MonitorsTemplate, MonitorsManager){

	var ContentFilteringMonitorsView = Backbone.View.extend({
        initialize:function(options){
            console.log(options);
            this.category = options.category;
            this.startTime = options.startTime;
            this.endTime = options.endTime;
            this.render();
        },
        //
        render: function(){
            console.log('Content Filtering monitors view rendered');

            var me=this,
                filterObj = {
                    "category": me.category,
                    "startTime": me.startTime,
                    "endTime": me.endTime
                };
                monitorsManager = new MonitorsManager(filterObj),
                graphTitles = [],
                graphTitles.push({
                    'first-chart-title': "Top Blocked Protocol commands",
                    'second-chart-title': "Top Reasons",
                    'third-chart-title': "Top Sources" 
                });
                graphObj = {'ev-monitors-views': graphTitles,
                            'last-updated-time': me.endTime
                           };

                contentFilteringMonitorsHtml = render_template(MonitorsTemplate, graphObj);
            me.$el.append(contentFilteringMonitorsHtml);
            me.containers = {
                "mainContainer": me.$el,
                "firstBarChartContainer": me.$el.find(".ev-first-bar-chart-view"),
                "secondBarChartContainer": me.$el.find(".ev-second-bar-chart-view"),
                "thirdBarChartContainer": me.$el.find(".ev-third-bar-chart-view")
            };

            me.$el.find(".ev-fourth-bar-chart-container").hide();

            // Displaying spinner widget
            monitorsManager.displaySpinner(me.containers.firstBarChartContainer[0], "Loading Top Blocked Commands Monitor...");
            monitorsManager.displaySpinner(me.containers.secondBarChartContainer[0], "Loading Top Reasons Monitor...");
            monitorsManager.displaySpinner(me.containers.thirdBarChartContainer[0], "Loading Top Sources Monitor...");

            // Building Content Filtering - Top Blocked Protocol commands Monitor
            monitorsManager.buildTopBlockedCmdsView(me.containers.firstBarChartContainer[0], me.category, me.startTime, me.endTime);
            // Building Content Filtering - Top Blocked File Extensions Monitor
            monitorsManager.buildTopReasonsView(me.containers.secondBarChartContainer[0]);
            // Building Content Filtering - Top Sources Monitor
            monitorsManager.buildTopSourcesView(me.containers.thirdBarChartContainer[0]);

            return this;
        }
        //

    });
    return ContentFilteringMonitorsView;
});

