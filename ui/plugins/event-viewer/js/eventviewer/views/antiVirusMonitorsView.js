/**
 *  Anti Virus Monitors View to display the Top monitors
 *
 *  @module AntiVirusMonitorsView [EventViewer]
 *  @author Shini <shinig@juniper.net>
 *  @copyright Juniper Networks, Inc. 2015
 * */

define(['backbone', 'lib/template_renderer/template_renderer', 'text!../templates/antiVirusMonitorsView.html',
	     '../utils/monitorsManager.js' ],
function( Backbone, render_template, MonitorsTemplate, MonitorsManager){

	var AntiVirusMonitorsView = Backbone.View.extend({
        initialize:function(options){
            console.log(options);
            this.category = options.category;
            this.startTime = options.startTime;
            this.endTime = options.endTime;
            this.render();
        },
        //
        render: function(){
            console.log('Anti Virus monitors view rendered');

            var me=this,
                filterObj = {
                    "category": me.category,
                    "startTime": me.startTime,
                    "endTime": me.endTime
                };
                monitorsManager = new MonitorsManager(filterObj),
                graphTitles = [],
                graphTitles.push({
                    'first-bar-chart-title': "Top Sources",
                    'second-bar-chart-title': "Top Destinations",
                    'third-bar-chart-title': "Top Reporting/Attacked Devices",
                    'fourth-bar-chart-title': "Top Viruses",
                    'fifth-bar-chart-title': "Top Source Countries",
                    'sixth-bar-chart-title': "Top Destination Countries"
                });
                graphObj = {'ev-anti-virus-monitors-views': graphTitles,
                            'last-updated-time': me.endTime
                           };
                antiVirusMonitorsHtml = render_template(MonitorsTemplate, graphObj);
            me.$el.append(antiVirusMonitorsHtml);
            me.containers = {
                "mainContainer": me.$el,
                "topSourcesContainer": me.$el.find(".first-bar-chart-view"),
                "topDestContainer": me.$el.find(".second-bar-chart-view"),
                "topAttackedDevicesContainer": me.$el.find(".third-bar-chart-view"),
                "topVirusesContainer": me.$el.find(".fourth-bar-chart-view"),
                "topSourcesCountriesContainer": me.$el.find(".fifth-bar-chart-view"),
                "topDestinationCountriesContainer": me.$el.find(".sixth-bar-chart-view")
            };

            // Hiding unused container
            me.$el.find(".seventh-bar-chart-view").hide();
            // Displaying spinner widget
            monitorsManager.displaySpinner(me.containers.topSourcesContainer[0], "Loading Top Sources Monitor...");
            monitorsManager.displaySpinner(me.containers.topDestContainer[0], "Loading Top Destinations Monitor...");
            monitorsManager.displaySpinner(me.containers.topAttackedDevicesContainer[0], "Loading Top  Reporting/Attacked Device Monitor...");
            monitorsManager.displaySpinner(me.containers.topVirusesContainer[0], "Loading Top Viruses Monitor...");
            monitorsManager.displaySpinner(me.containers.topSourcesCountriesContainer[0], "Loading Top Source Countries Devices Monitor...");
            monitorsManager.displaySpinner(me.containers.topDestinationCountriesContainer[0], "Loading Top Destination Countries Devices Monitor...");

            // Building Anti Virus - Top Sources Monitor
            monitorsManager.buildTopSourcesView(me.containers.topSourcesContainer[0]);
            // Building Anti Virus - Top Destinations Monitor
            monitorsManager.buildTopDestinationsView(me.containers.topDestContainer[0]);
            // Building Anti Virus - Top Reporting/Attacked Devices Monitor
            monitorsManager.buildTopAttackedDevicesView(me.containers.topAttackedDevicesContainer[0]);
            // Building Anti Virus - Top Viruses Monitors
            monitorsManager.buildTopVirusesView(me.containers.topVirusesContainer[0]);
            // Building Anti Virus - Top Source Countries Devices
            monitorsManager.buildTopSourceCountriesView(me.containers.topSourcesCountriesContainer[0]);
            // Building Anti Virus - Top Destination Countries Devices
            monitorsManager.buildTopDestinationCountriesView(me.containers.topDestinationCountriesContainer[0]);

            return this;
        }

    });
    return AntiVirusMonitorsView;
});

