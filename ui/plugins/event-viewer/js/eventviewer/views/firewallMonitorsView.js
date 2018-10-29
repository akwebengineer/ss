/**
 *  Firewall Monitors View to display the Top monitors
 *
 *  @module FirewallMonitors [EventViewer]
 *  @author Shini <shinig@juniper.net>
 *  @copyright Juniper Networks, Inc. 2015
 * */

define(['backbone', 'lib/template_renderer/template_renderer', 'text!../templates/firewallMonitorsView.html',
	 '../utils/monitorsManager.js'],
function( Backbone, render_template, FirewallMonitorsTemplate, MonitorsManager){

	var FirewallMonitorsView = Backbone.View.extend({
        initialize:function(options){
            console.log(options);
            this.category = options.category;
            this.startTime = options.startTime;
            this.endTime = options.endTime;
            this.render();
        },
        //
        render: function(){
            console.log('Firewall monitors view rendered');

            var me = this,
                filterObj = {
                    "category": me.category,
                    "startTime": me.startTime,
                    "endTime": me.endTime
                };
                monitorsManager = new MonitorsManager(filterObj),
                graphTitles = [],
                graphTitles.push({
                    'first-chart-title': "Top Sources",
                    'second-chart-title': "Top Destinations",
                    'third-chart-title': "Top Users",
                    'fourth-chart-title': "Top Reporting Devices"
                });
                graphObj = {'ev-monitors-views': graphTitles,
                            'last-updated-time': me.endTime
                           };

                firewallMonitorsHtml = render_template(FirewallMonitorsTemplate, graphObj);
            me.$el.append(firewallMonitorsHtml);
            me.containers = {
                "mainContainer": me.$el,
                "topSourcesContainer": me.$el.find(".ev-first-bar-chart-view"),
                "topDestContainer": me.$el.find(".ev-second-bar-chart-view"),
                "topUsersContainer": me.$el.find(".ev-third-bar-chart-view"),
                "topDevicesContainer": me.$el.find(".ev-fourth-bar-chart-view")
            };
            // Displaying spinner widget
            monitorsManager.displaySpinner(me.containers.topSourcesContainer[0], "Loading Top Sources Monitor...");
            monitorsManager.displaySpinner(me.containers.topDestContainer[0], "Loading Top Destinations Monitor...");
            monitorsManager.displaySpinner(me.containers.topUsersContainer[0], "Loading Top Users Monitor...");
            monitorsManager.displaySpinner(me.containers.topDevicesContainer[0], "Loading Top Reporting Devices Monitor...");

            // Building Firewall - Top Sources Monitor
            monitorsManager.buildTopSourcesView(me.containers.topSourcesContainer[0]);
            // Building Firewall - Top Destinations Monitor
            monitorsManager.buildTopDestinationsView(me.containers.topDestContainer[0]);
            // Building Firewall - Top Users Monitor
            monitorsManager.buildTopUsersView(me.containers.topUsersContainer[0]);
            // Building Firewall - Top Reporting Devices
            monitorsManager.buildTopDevicesView(me.containers.topDevicesContainer[0]);

            return this;
        }
        //

    });
    return FirewallMonitorsView;
});

