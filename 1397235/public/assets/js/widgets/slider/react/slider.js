/**
 * A module that builds a Slider React component using the Slider widget
 * The configuration is included as a part of the Slider element properties and the container is the same where the element is added
 *
 * @module Slider
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */
define([
    'react',
    'react-dom',
    'prop-types',
    'widgets/slider/sliderWidget'
], function (React, ReactDOM, PropTypes, SliderWidget) {

    class Slider extends React.Component {

        constructor(props) {
            super(props);
        }

        componentDidMount() {
            let {children, scale, onChange, ...sliderOthers} = this.props, //The left side just picks off the corresponding parts of the right side.  Whatever isn’t picked off gets assigned to …sliderOthers
                sliderHandles = this.getHandles(this.props.children);
            this.sliderWidget = new SliderWidget({
                handles: sliderHandles,
                scale: this.props.scale,
                options: {...sliderOthers},
                container: this.el
            }).build();
            this.bindEvents();
        }

        bindEvents() {
            const self = this;
            this.$el = $(this.el);
            if (this.props.onChange) {
                this.$el.find(".slider-wrapper")[0].noUiSlider.on("update", (values, handle) => {
                    self.props.onChange(e, {
                        "handle": handle,
                        "values": self.sliderWidget.getValues()
                    });
                });
            }
        }

        getHandles(handles) {
            return React.Children.map(handles, handle => handle.props);
        }

        getHandlesArr(handles) {
            return this.getHandles(handles).map(handle => parseFloat(handle.value));
        }

        componentDidUpdate(prevProps) {
            let prevHandles = this.getHandlesArr(prevProps.children),
                currentHandles = this.getHandlesArr(this.props.children);
            if (_.difference(prevHandles, currentHandles).length !=0) { //if some of the handles value is new, update the handles value
                this.sliderWidget.setValues(currentHandles);
            }
        }

        componentWillUnmount() {
            this.sliderWidget.destroy();
        }

        render() {
            return (
                <div className="slider-component"
                     ref={el => this.el = el}>
                </div>
            );
        }

    }

    Slider.propTypes = {
        scale: PropTypes.shape({
            range: PropTypes.shape({
                min: PropTypes.number,
                max: PropTypes.number,
            }),
            numberOfValues: PropTypes.number,
            density: PropTypes.density
        }),
        step: PropTypes.number,
        handleDistance: PropTypes.shape({
            min: PropTypes.number,
            max: PropTypes.number
        }),
        label: PropTypes.oneOfType([
            PropTypes.bool,
            PropTypes.shape({
                format: PropTypes.func,
                unformat: PropTypes.func,
                width: PropTypes.string,
            })
        ]),
        onChange: PropTypes.func
    };

    class SliderHandle extends React.Component {

        constructor(props) {
            super(props);
        }

        render() {
            return null;
        }
    }

    SliderHandle.propTypes = {
        value: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string
        ]),
        left: PropTypes.oneOfType([
            PropTypes.bool,
            PropTypes.shape({
                color: PropTypes.string
            })
        ]),
        right: PropTypes.oneOfType([
            PropTypes.bool,
            PropTypes.shape({
                color: PropTypes.string
            })
        ]),
        label: PropTypes.bool,
        disabled: PropTypes.bool
    };

    return {
        Slider: Slider,
        SliderHandle: SliderHandle
    };

});