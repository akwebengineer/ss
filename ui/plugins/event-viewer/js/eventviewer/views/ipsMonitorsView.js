/**
 * IPS Monitors View to display the Top monitors
 *
 *  @module IPSMonitorsView [EventViewer]
 *  @author Shini <shinig@juniper.net>
 *  @copyright Juniper Networks, Inc. 2015
 * */

define(['backbone', 'lib/template_renderer/template_renderer', 'text!../templates/ipsMonitorsView.html',
	    '../utils/monitorsManager.js'],
function( Backbone, render_template, MonitorsTemplate, MonitorsManager){

	var IPSMonitorsView = Backbone.View.extend({
        initialize:function(options){
            console.log(options);
            this.category = options.category;
            this.startTime = options.startTime;
            this.endTime = options.endTime;
            this.render();
        },
        //
        render: function(){
            console.log('IPS monitors view rendered');

            var me=this,
                filterObj = {
                    "category": me.category,
                    "startTime": me.startTime,
                    "endTime": me.endTime
                };
                monitorsManager = new MonitorsManager(filterObj),
                graphTitles = [],
                graphTitles.push({
                    'first-bar-chart-title':"IPS severities",
                    'second-bar-chart-title': "Top Sources",
                    'third-bar-chart-title': "Top Destinations",
                    'fourth-bar-chart-title': "Top Reporting/Attacked Devices",
                    'fifth-bar-chart-title': "Top IPS Attacks",
                    'sixth-bar-chart-title': "Top Source Countries",
                    'seventh-bar-chart-title': "Top Destination Countries"
                });
                graphObj = {'ev-anti-virus-monitors-views': graphTitles,
                            'last-updated-time': me.endTime
                           };
                ipsMonitorsHtml = render_template(MonitorsTemplate, graphObj);
            me.$el.append(ipsMonitorsHtml);
            me.containers = {
                "mainContainer": me.$el,
                "donutChart": me.$el.find(".first-bar-chart-view"),
                "topSourcesContainer": me.$el.find(".second-bar-chart-view"),
                "topDestContainer": me.$el.find(".third-bar-chart-view"),
                "topAttackedDevicesContainer": me.$el.find(".fourth-bar-chart-view"),
                "topIPSAttacksContainer": me.$el.find(".fifth-bar-chart-view"),
                "topSourcesCountriesContainer": me.$el.find(".sixth-bar-chart-view"),
                "topDestinationCountriesContainer": me.$el.find(".seventh-bar-chart-view")
            };

            // Displaying spinner widget
            monitorsManager.displaySpinner(me.containers.donutChart[0], "Loading IPS severities...");
            monitorsManager.displaySpinner(me.containers.topSourcesContainer[0], "Loading Top Sources Monitor...");
            monitorsManager.displaySpinner(me.containers.topDestContainer[0], "Loading Top Destinations Monitor...");
            monitorsManager.displaySpinner(me.containers.topAttackedDevicesContainer[0], "Loading Top  Reporting/Attacked Device Monitor...");
            monitorsManager.displaySpinner(me.containers.topIPSAttacksContainer[0], "Loading Top IPS Attacks Monitor...");
            monitorsManager.displaySpinner(me.containers.topSourcesCountriesContainer[0], "Loading Top Source Countries Devices Monitor...");
            monitorsManager.displaySpinner(me.containers.topDestinationCountriesContainer[0], "Loading Top Destination Countries Devices Monitor...");

            // Building IPS - IPS severities
            monitorsManager.buildIPSSeveritiesView(me.containers.donutChart[0], me.category, me.startTime, me.endTime);
            // Building IPS - Top Sources Monitor
            monitorsManager.buildTopSourcesView(me.containers.topSourcesContainer[0]);
            // Building IPS - Top Destinations Monitor
            monitorsManager.buildTopDestinationsView(me.containers.topDestContainer[0]);
            // Building IPS - Top Reporting/Attacked Devices Monitor
            monitorsManager.buildTopAttackedDevicesView(me.containers.topAttackedDevicesContainer[0]);
            // Building IPS - Top IPS Attacks Monitors
            monitorsManager.buildTopIPSAttacksView(me.containers.topIPSAttacksContainer[0]);
            // Building IPS - Top Source Countries Devices
            monitorsManager.buildTopSourceCountriesView(me.containers.topSourcesCountriesContainer[0]);
            // Building IPS - Top Destination Countries Devices
            monitorsManager.buildTopDestinationCountriesView(me.containers.topDestinationCountriesContainer[0]);

            return this;
        }
        //

    });
    return IPSMonitorsView;
});

