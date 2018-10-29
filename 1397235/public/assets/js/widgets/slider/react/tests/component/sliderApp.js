/**
 * A view that uses the slider component (created from the slider widget) to create a React component from the Slider component so states can be handled by the user of the Slider component
 *
 * @module SliderApp
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */
define([
    'react',
    'react-dom',
    'es6!widgets/slider/react/slider',
], function (React, ReactDOM, SliderComponent) {

        const Slider = SliderComponent.Slider,
            SliderHandle = SliderComponent.SliderHandle;

        class SliderApp extends React.Component {

            constructor(props) {
                super(props);
                this.state = {
                    value: [5, 8],
                    scale: {
                        range: {
                            min: 0,
                            max: 10
                        }
                    }
                };
                this.onChange = this.onChange.bind(this);
                this.getValue = this.getValue.bind(this);
                this.setValue = this.setValue.bind(this);
            }

            onChange(e, data) {
                this.setState({value: data.values});
                console.log(data);
            }

            getValue(e) {
                console.log(this.state.value);
            }

            setValue(e) {
                this.setState({value: [3,7]});
            }

            render() {
                return (
                    <div>
                        <Slider
                            scale={this.state.scale}
                            onChange={this.onChange}
                        >
                            <SliderHandle value={this.state.value[0]}/>
                            <SliderHandle value={this.state.value[1]}/>
                        </Slider>
                        <div className="slider-buttons">
                            <span className="slipstream-secondary-button" onClick={this.setValue}>Set Value</span>
                            <span className="slipstream-primary-button" onClick={this.getValue}>Get Value</span>
                        </div>
                    </div>
                );
            }
        }

    return SliderApp;

});