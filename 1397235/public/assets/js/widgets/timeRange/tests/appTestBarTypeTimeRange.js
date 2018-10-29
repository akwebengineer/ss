/**
 * A view that uses the TimeRangeWidget to produce a sample of the bar type of the time range
 * This example shows how to display the bar type of the time range
 *
 * @module Application Bar Type of Time Range View
 * @author Eva Wang <iwang@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */

define([
    'backbone',
    'widgets/timeRange/timeRangeWidget',
    './testData'
], function(Backbone, TimeRangeWidget, TestData){
    var TimeRangeView = Backbone.View.extend({
        initialize: function () {
            this.render();
        },

        render: function () {
            var timeRangeElement = this.$el;

            this.timeRangeWidgetObj = new TimeRangeWidget(this.generateConf(timeRangeElement));
            this.timeRangeWidgetObj.build();   
        
            return this;
        },
        generateConf: function(el){
            return {
                container: el,
                options: { 
                    data: TestData.navigatorBarData.data,
                    type: 'bar',
                    yAxis: {
                        enabled: true, //optional - default is true
                        title: "MB/s",
                        min: 0,
                        max: 400
                    },
                    height: {
                        chart: 60, //reduce the chart height from default 88
                        timeRangeSelector: 30 //reduce the selector height from default 65
                   }
                }
            }
        }
    });

    return TimeRangeView;
});