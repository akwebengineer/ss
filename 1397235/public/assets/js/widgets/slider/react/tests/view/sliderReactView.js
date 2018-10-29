/**
 * A view that uses the slider component (created from the slider widget) to render a slider using React
 *
 * @module SliderComponent View
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */
define([
    'react',
    'react-dom',
    'es6!widgets/slider/react/slider',
    'es6!widgets/slider/react/tests/component/sliderApp',
    'widgets/slider/conf/configurationSample',
], function (React, ReactDOM, SliderComponent, SliderApp, configurationSample) {

    var SliderComponentView = function (options) {
        this.el = document.createElement("div");

        this.render = function () {
            const Slider = SliderComponent.Slider,
                SliderHandle = SliderComponent.SliderHandle,
                self = this;
            this.setConfigurationSample();

            ReactDOM.render(
                <div className="slider-widget-test">
                    <div className="slipstream-content-title">Slider Component</div>
                    <div className="range-type">
                        <h4>One Range: open end</h4>
                        <Slider {...self.configurationSample.oneRangeCloseStartOpenEnd}>
                            <SliderHandle {...configurationSample.oneRangeCloseStartOpenEnd.handles[0]}/>
                        </Slider>
                    </div>
                    <div className="range-type">
                        <h4>One Range: open end - Read only</h4>
                        <Slider {...self.configurationSample.oneRangeCloseStartOpenEndReadOnly}>
                            <SliderHandle {...configurationSample.oneRangeCloseStartOpenEndReadOnly.handles[0]}/>
                        </Slider>
                    </div>
                    <div className="range-type">
                        <h4>One Range: open start and open end</h4>
                        <Slider {...self.configurationSample.oneRangeOpenStartOpenEnd}>
                            <SliderHandle {...configurationSample.oneRangeOpenStartOpenEnd.handles[0]}/>
                            <SliderHandle {...configurationSample.oneRangeOpenStartOpenEnd.handles[1]}/>
                        </Slider>
                    </div>
                    <div className="range-type">
                        <h4>Three Ranges, fixed scale</h4>
                        <Slider {...self.configurationSample.threeRangeCloseStartCloseEnd}>
                            <SliderHandle {...configurationSample.threeRangeCloseStartCloseEnd.handles[0]}/>
                            <SliderHandle {...configurationSample.threeRangeCloseStartCloseEnd.handles[1]}/>
                        </Slider>
                    </div>
                    <div className="range-type">
                        <h4>Two Ranges, user-defined bar colors</h4>
                        <Slider {...self.configurationSample.twoRangeOpenStartOpenEnd}>
                            <SliderHandle {...configurationSample.twoRangeOpenStartOpenEnd.handles[0]}/>
                            <SliderHandle {...configurationSample.twoRangeOpenStartOpenEnd.handles[1]}/>
                            <SliderHandle {...configurationSample.twoRangeOpenStartOpenEnd.handles[2]}/>
                        </Slider>
                    </div>
                    <div className="range-type">
                        <h4>Four Ranges, user-defined labels</h4>
                        <Slider {...self.configurationSample.fourRangeCloseStartCloseEnd}>
                            <SliderHandle {...configurationSample.fourRangeCloseStartCloseEnd.handles[0]}/>
                            <SliderHandle {...configurationSample.fourRangeCloseStartCloseEnd.handles[1]}/>
                            <SliderHandle {...configurationSample.fourRangeCloseStartCloseEnd.handles[2]}/>
                        </Slider>
                    </div>
                    <div className="range-type">
                        <h4>Three Ranges, open start</h4>
                        <Slider {...self.configurationSample.fourRangeOpenStartCloseEnd}>
                            <SliderHandle {...configurationSample.fourRangeOpenStartCloseEnd.handles[0]}/>
                            <SliderHandle {...configurationSample.fourRangeOpenStartCloseEnd.handles[1]}/>
                            <SliderHandle {...configurationSample.fourRangeOpenStartCloseEnd.handles[2]}/>
                            <SliderHandle {...configurationSample.fourRangeOpenStartCloseEnd.handles[3]}/>
                        </Slider>
                    </div>
                    <div className="range-type">
                        <h4>Basic example</h4>
                        <SliderApp/>
                    </div>
                </div>
                , this.el
            );
            return this;
        };

        this.setConfigurationSample = function () {
            var getSliderConfiguration = function (configSample) {
                return {
                    ...configSample.options,
                    scale: configSample.scale
                }
            };
            this.configurationSample = {
                oneRangeCloseStartOpenEnd: getSliderConfiguration(configurationSample.oneRangeCloseStartOpenEnd),
                oneRangeCloseStartOpenEndReadOnly: getSliderConfiguration(configurationSample.oneRangeCloseStartOpenEndReadOnly),
                oneRangeOpenStartOpenEnd: getSliderConfiguration(configurationSample.oneRangeOpenStartOpenEnd),
                threeRangeCloseStartCloseEnd: getSliderConfiguration(configurationSample.threeRangeCloseStartCloseEnd),
                twoRangeOpenStartOpenEnd: getSliderConfiguration(configurationSample.twoRangeOpenStartOpenEnd),
                fourRangeCloseStartCloseEnd: getSliderConfiguration(configurationSample.fourRangeCloseStartCloseEnd),
                fourRangeOpenStartCloseEnd: getSliderConfiguration(configurationSample.fourRangeOpenStartCloseEnd)
            };
        };

    };

    return SliderComponentView;

});