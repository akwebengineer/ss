define([
    'backbone',
    'lib/template_renderer/template_renderer',
    'text!widgets/lineChart/tests/templates/lineChartExample.html',
    'widgets/lineChart/tests/appTestBasicLine',
    'widgets/lineChart/tests/appTestMarkersLine',
    'widgets/lineChart/tests/appTestMultipleMarkersLine',
    'widgets/lineChart/tests/appTestCustomColorsLine',
    'widgets/lineChart/tests/appTestPlotLine',
    'widgets/lineChart/tests/appTestSmallLine',
    'es6!widgets/lineChart/react/tests/views/basicLineChartComponentView',
], function(Backbone, render_template, example, LineChartView1, LineChartView2, LineChartView3, LineChartView4, LineChartView5, LineChartView6, BasicLineChartComponent){

    var lineChartWidget = Backbone.View.extend({
        initialize: function(){
            this.addContent(this.$el, example);
            !this.options.pluginView && this.render();
        },
        render: function () {
            new LineChartView1({
                el: this.$el.find('#linechart-basic')
            });
            new LineChartView2({
                el: this.$el.find('#linechart-markers')
            });
            new LineChartView3({
                el: this.$el.find('#linechart-multiple-markers')
            });
            new LineChartView4({
                el: this.$el.find('#linechart-custom-colors')
            });
            new LineChartView5({
                el: this.$el.find('#linechart-plot-lines')
            });
            new LineChartView6({
                el: this.$el.find('#linechart-small')
            });

            // React Line Chart
            new BasicLineChartComponent({
                $el: this.$el.find('#linechart-basic-component')
            }).render();
            return this;
        },
        addContent:function($container, template) {
            $container.append((render_template(template)));
        }
    });

    return lineChartWidget;
});