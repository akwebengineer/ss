define([
    'backbone',
    'lib/template_renderer/template_renderer',
    'widgets/timeSeriesChart/tests/appTimeSeriesChart',
    'widgets/timeSeriesChart/tests/appAreaSplineChart',
    'es6!widgets/timeSeriesChart/react/tests/views/areaSplineTimeSeriesChartComponentView',
    'text!widgets/timeSeriesChart/tests/templates/timeSeriesChartExample.html'
], function(Backbone, render_template, TimeSeriesAreaChartView, TimeSeriesAreaSplineChartView, TimeSeriesAreaSplineChartComponent, example){

    var timeSeriesChartWidget = Backbone.View.extend({
        initialize: function(){
            this.addContent(this.$el, example);
            !this.options.pluginView && this.render();
        },
        render: function () {
            new TimeSeriesAreaChartView({
               el: this.$el.find('#timeSeriesChart')
            });
            new TimeSeriesAreaSplineChartView({
               el: this.$el.find('#areaSplineChart')
            });

            // React Time Series Chart
            new TimeSeriesAreaSplineChartComponent({
                $el: this.$el.find('#areaSplineComponent')
            }).render();

            return this;
        },
        addContent:function($container, template) {
            $container.append((render_template(template)));
            
        } 
    });
    
    return timeSeriesChartWidget;
});