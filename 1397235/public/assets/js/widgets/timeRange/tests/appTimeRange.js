define([
    'backbone',
    'lib/template_renderer/template_renderer',
    'widgets/timeRange/tests/appTestGrid',
    'widgets/timeRange/tests/appTestBarChart',
    'widgets/timeRange/tests/appTestMultiData',
    'widgets/timeRange/tests/appTestSetTimeRange',
    'widgets/timeRange/tests/appTestBarTypeTimeRange',
    'text!widgets/timeRange/tests/templates/timeRangeExample.html'
], function(Backbone, render_template, TimeRangeView1, TimeRangeView2, TimeRangeView3, TimeRangeView4, TimeRangeView5, example){

    var barChartWidget = Backbone.View.extend({
        initialize: function(){
            this.addContent(this.$el, example);
            !this.options.pluginView && this.render();
        },
        render: function () {
            new TimeRangeView1({
                el: this.$el.find('#timeRange1')
            });
            new TimeRangeView2({
                el: this.$el.find('#timeRange2')
            });
            new TimeRangeView3({
                el: this.$el.find('#timeRange3')
            });
            new TimeRangeView4({
                el: this.$el.find('#timeRange4')
            });
            new TimeRangeView5({
                el: this.$el.find('#timeRange5')
            });
            return this;
        },
        addContent:function($container, template) {
            $container.append((render_template(template)));
            
        } 
    });

    
    return barChartWidget;
});