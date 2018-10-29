/**
 * A view that uses the slider widget to render a toggle button from a configuration object
 *
 * @module Slider View
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */

define([
    'backbone',
    'widgets/slider/sliderWidget',
    'widgets/slider/conf/configurationSample',
    'text!widgets/slider/tests/templates/sliderExample.html'
], function(Backbone, SliderWidget, configurationSample, sliderExample){
    var SliderView = Backbone.View.extend({

        events: {
            "click .get-slider-value": "getValues"
        },

        initialize: function () {
            this.addTemplates();
            this.bindSliderEvents();
        },

        render: function () {
            new SliderWidget(_.extend(configurationSample.oneRangeCloseStartOpenEnd, {
                "container": this.$oneRangeCloseStartOpenEnd
            })).build();

            new SliderWidget(_.extend(configurationSample.oneRangeCloseStartOpenEndReadOnly, {
                "container": this.$oneRangeCloseStartOpenEndReadOnly
            })).build();

            new SliderWidget(_.extend(configurationSample.oneRangeOpenStartOpenEnd, {
                "container": this.$oneRangeOpenStartOpenEnd
            })).build();

            new SliderWidget(_.extend(configurationSample.threeRangeCloseStartCloseEnd, {
                "container": this.$threeRangeCloseStartCloseEnd
            })).build();

            new SliderWidget(_.extend(configurationSample.twoRangeOpenStartOpenEnd, {
                "container": this.$twoRangeOpenStartOpenEnd
            })).build();

            new SliderWidget(_.extend(configurationSample.fourRangeCloseStartCloseEnd, {
                "container": this.$fourRangeCloseStartCloseEnd
            })).build();

            this.fourRangeOpenStartCloseEndSlider = new SliderWidget(_.extend(configurationSample.fourRangeOpenStartCloseEnd, {
                "container": this.$fourRangeOpenStartCloseEnd
            })).build();

            return this;
        },

        bindSliderEvents: function () {
            var self = this;
            this.$oneRangeCloseStartOpenEnd.bind("slipstreamSlider.handleValueUpdated", function (e, valueObj){
               console.log(valueObj);
            });
            this.$oneRangeOpenStartOpenEnd.bind("slipstreamSlider.handleValueUpdated", function (e, valueObj){
                console.log(valueObj);
            });
            this.$threeRangeCloseStartCloseEnd.bind("slipstreamSlider.handleValueUpdated", function (e, valueObj){
                self.setThreeRangeSliderValue(valueObj.values);
                console.log(valueObj);
            });
            this.$twoRangeOpenStartOpenEnd.bind("slipstreamSlider.handleValueUpdated", function (e, valueObj){
                console.log(valueObj);
            });
            this.$fourRangeCloseStartCloseEnd.bind("slipstreamSlider.handleValueUpdated", function (e, valueObj){
                console.log(valueObj);
            });
            this.$fourRangeOpenStartCloseEnd.bind("slipstreamSlider.handleValueUpdated", function (e, valueObj){
                console.log(valueObj.values, valueObj.handle);
            });
        },

        getValues: function () {
            var value = this.fourRangeOpenStartCloseEndSlider.getValues();
            console.log(value);
        },

        addTemplates: function () {
            this.$el.append(sliderExample);

            //slider containers
            this.$oneRangeCloseStartOpenEnd = this.$el.find("#slider-demo-range-1");
            this.$oneRangeCloseStartOpenEndReadOnly = this.$el.find("#slider-demo-range-1-1");
            this.$oneRangeOpenStartOpenEnd = this.$el.find("#slider-demo-range-2");
            this.$threeRangeCloseStartCloseEnd = this.$el.find("#slider-demo-range-3");
            this.$twoRangeOpenStartOpenEnd = this.$el.find("#slider-demo-range-4");
            this.$fourRangeCloseStartCloseEnd = this.$el.find("#slider-demo-range-5");
            this.$fourRangeOpenStartCloseEnd = this.$el.find("#slider-demo-range-6");

            //value containers
            this.$threeRangeCloseStartCloseEndValue = this.$el.find("#slider-value-range-3");
        },

        setThreeRangeSliderValue: function (value) {
            this.$threeRangeCloseStartCloseEndValue.empty();
            var value1 = parseInt(value[0]) - 1,
                value2 = value[0],
                value3 = parseInt(value[1]) -1,
                value4 = value[1];

            var sliderValue = "Permit: 0 - " +  value1 + ", Monitor: " + value2 + " - " + value3 + ", Block: " + value4 + " - 10";
            this.$threeRangeCloseStartCloseEndValue.append(sliderValue)
        }

    });

    return SliderView;
});