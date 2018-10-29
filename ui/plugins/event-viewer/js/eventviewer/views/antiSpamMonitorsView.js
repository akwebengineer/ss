/**
 *  Anti Spam Monitors View to display the Top monitors
 *
 *  @module AntiSpamMonitors [EventViewer]
 *  @author Shini <shinig@juniper.net>
 *  @copyright Juniper Networks, Inc. 2015
 * */

define(['backbone', 'lib/template_renderer/template_renderer', 'text!../templates/antiSpamMonitorsView.html',
	    '../utils/monitorsManager.js'],
function( Backbone, render_template, MonitorsTemplate, MonitorsManager){

	var AntiSpamMonitorsView = Backbone.View.extend({
        initialize:function(options){
            console.log(options);
            this.category = options.category;
            this.startTime = options.startTime;
            this.endTime = options.endTime;
            this.render();
        },
        //
        render: function(){
            console.log('Anti Spam monitors view rendered');

            var me=this,
                filterObj = {
                    "category": me.category,
                    "startTime": me.startTime,
                    "endTime": me.endTime
                };
                monitorsManager = new MonitorsManager(filterObj),
                graphTitles = [],
                graphTitles.push({
                    'first-chart-title': "Top Sources"
                });
                graphObj = {'ev-monitors-views': graphTitles,
                            'last-updated-time': me.endTime
                           };
                antiSpamMonitorsHtml = render_template(MonitorsTemplate, graphObj);
            me.$el.append(antiSpamMonitorsHtml);

            me.containers = {
                "mainContainer": me.$el,
                "firstBarChartContainer": me.$el.find(".ev-first-bar-chart-view")
            };
            // hide unused containers
            me.$el.find(".ev-second-bar-chart-container").hide();

            // Displaying spinner widget
            monitorsManager.displaySpinner(me.containers.firstBarChartContainer[0], "Loading Top Sources Monitor...");

            // Building Anti Spam -  Top Sources Monitor
            monitorsManager.buildTopSourcesView(me.containers.firstBarChartContainer[0]);

            return this;
        }
        //
    });
    return AntiSpamMonitorsView;
});

