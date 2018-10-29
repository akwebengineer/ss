/**
 * A generic bar chart for displaying top n
  * @module GenericBarWidget
 * @author Dharma<adharmendran@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
*/
define(['backbone', 'widgets/barChart/barChartWidget'], function(Backbone, BarChartWidget){
    //
    var GenericBarWidget = Backbone.View.extend({
        //
        initialize:function(options){
            var me=this;
            me.options = options;
            me.render();
        },

        render: function(){
            var me=this,
                barChartElement = this.$el,
                conf = {
                    container: barChartElement,
                    options: me.options.barConfig
                };

            var barChartWidgetObj = new BarChartWidget(conf);
            barChartWidgetObj.build();
            return this;
        }
        //
    });
    //
    return GenericBarWidget;
})