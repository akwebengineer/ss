/**
 *  A generic bar chart widget for displaying bar charts in the summary view
 *
 *  @module BarChartWidget[EventViewer]
 *  @author Shini <shinig@juniper.net>
 *  @copyright Juniper Networks, Inc. 2015
 * */
define(['backbone',
        'widgets/barChart/barChartWidget'
        ],
 function(Backbone, BarChartWidget){

    var GenericBarChartWidget = Backbone.View.extend({

        initialize:function(options){
            var me=this;
            me.options = options;
            me.render();
        },
        //
        render: function(){
            var me=this,
                barChartContainer = this.$el,
                conf = {
                    container: barChartContainer,
                    options: me.options.chartConfig
                };

            var barChartWidgetObj = new BarChartWidget(conf);
            barChartWidgetObj.build();
            return this;
        }
        //
    });

    return GenericBarChartWidget;
})