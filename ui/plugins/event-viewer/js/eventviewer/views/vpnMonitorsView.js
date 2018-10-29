/**
 *  VPN Monitors View to display the Top monitors
 *
 *  @module VPNMonitors [EventViewer]
 *  @author Shini <shinig@juniper.net>
 *  @copyright Juniper Networks, Inc. 2015
 * */

define(['backbone', 'lib/template_renderer/template_renderer', 'text!../templates/vpnMonitorsView.html',
	    '../utils/monitorsManager.js'],
function( Backbone, render_template, VPNMonitorsTemplate, MonitorsManager){

	var VPNMonitorsView = Backbone.View.extend({
        initialize:function(options){
            console.log(options);
            this.category = options.category;
            this.startTime = options.startTime;
            this.endTime = options.endTime;
            this.render();
        },
        //
        render: function(){
            console.log('VPN monitors view rendered');

            var me=this,
                filterObj = {
                    "category": me.category,
                    "startTime": me.startTime,
                    "endTime": me.endTime
                };
                monitorsManager = new MonitorsManager(filterObj),
                graphTitles = [],                
                graphTitles.push({
                    'top-sources-title': "Top Sources",
                    'top-destinations-title': "Top Destinations",
                    'top-users-title': "Top Users",
                    "top-devices-title": "Top Reporting Devices"
                });
                graphObj = {'ev-vpn-monitors-views': graphTitles,
                            'last-updated-time': me.endTime
                            };
                vpnMonitorsHtml = render_template(VPNMonitorsTemplate, graphObj);
            me.$el.append(vpnMonitorsHtml);
            me.containers = {
                "mainContainer": me.$el,
                "topSourcesContainer": me.$el.find(".top-sources-graph"),
                "topDestContainer": me.$el.find(".top-destinations-graph"),
                "topDevicesContainer": me.$el.find(".top-reporting-devices-graph")
            };

            // Displaying spinner widget
            monitorsManager.displaySpinner(me.containers.topSourcesContainer[0], "Loading Top Sources Monitor...");
            monitorsManager.displaySpinner(me.containers.topDestContainer[0], "Loading Top Destinations Monitor...");
            monitorsManager.displaySpinner(me.containers.topDevicesContainer[0], "Loading Top Reporting Devices Monitor...");

            // Building VPN - Top Sources Monitor
            monitorsManager.buildTopSourcesView(me.containers.topSourcesContainer[0]);
            // Building VPN - Top Destinations Monitor
            monitorsManager.buildTopDestinationsView(me.containers.topDestContainer[0]);
            // Building VPN - Top Reporting Devices
            monitorsManager.buildTopDevicesView(me.containers.topDevicesContainer[0]);

            return this;
        }
        //
    });
    return VPNMonitorsView;
});

