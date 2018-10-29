define([
    'backbone',
    'lib/template_renderer/template_renderer',
    'widgets/barChart/tests/appTestTopSourceIPs',
    'widgets/barChart/tests/appTestTopDestIPs',
    'widgets/barChart/tests/appTestStackedBar',
    'widgets/barChart/tests/appTestColumnLegend',
    'widgets/barChart/tests/appTestBarThreshold',
    'widgets/barChart/tests/appTestBarLegend',
    'widgets/barChart/tests/appTestNatPoolUsage',
    'widgets/barChart/tests/appTestDeviceUtil',
    'widgets/barChart/tests/appTestStackedColumn',
    'widgets/barChart/tests/appTestClusteredBar',
    'es6!widgets/barChart/react/tests/views/basicBarChartComponentView',
    'text!widgets/barChart/tests/templates/barChartExample.html'
], function(Backbone, render_template, BarChartView1,BarChartView2,BarChartView3,BarChartView4,BarChartView5,BarChartView6,BarChartView7,BarChartView8,BarChartView9, BarChartView10,BasicBarChartComponent, example){

    var barChartWidget = Backbone.View.extend({
        initialize: function(){
            this.addContent(this.$el, example);
            !this.options.pluginView && this.render();
        },
        render: function () {
            new BarChartView1({
               el: this.$el.find('#barchart-top-source-ips')
            });
            new BarChartView2({
                el: this.$el.find('#barchart-top-dest-ips')
            });
            new BarChartView3({
                el: this.$el.find('#stacked-barchart')
            });
            new BarChartView4({
                el: this.$el.find('#columnchart-legend')
            });
            new BarChartView5({
                el: this.$el.find('#barchart-threshold')
            });
            new BarChartView6({
                el: this.$el.find('#barchart-legend')
            });
            new BarChartView7({
                el: this.$el.find('#barchart-nat-pool')
            });
            new BarChartView8({
                el: this.$el.find('#barchart-device-util')
            });
            new BarChartView9({
                el: this.$el.find('#stacked-columnchart')
            });
            new BarChartView10({
                el: this.$el.find('#clustered-barchart')
            });

            // React Bar Chart
            new BasicBarChartComponent({
                $el: this.$el.find('#barchart-basic-component')
            }).render();

            return this;
        },
        addContent:function($container, template) {
            $container.append((render_template(template)));
            
        } 
    });

    
    return barChartWidget;
});