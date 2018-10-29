/**
 * A module that builds a ColorPicker React component using the ColorPicker widget
 * The configuration is included as a part of the ColorPicker tag properties and the container is the same where the tag is added
 *
 * @module ColorPicker
 * @author Swena Gupta <gswena@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */
define([
    'react',
    'react-dom',
    'prop-types',
    'widgets/colorPicker/colorPickerWidget'
], function (React, ReactDOM, PropTypes, ColorPickerWidget) {

    class ColorPicker extends React.Component {

        constructor(props) {
            super(props);
        }

        componentDidMount() {
            this.$el = $(this.el);
            this.colorPickerWidget = new ColorPickerWidget({
                ...this.props,
                container: this.$el
            }).build();
            this.$el.find(".color-picker-input").bind("slipstreamColorPicker:onChange", (e, data) => {
                if(this.props.onChange)
                    this.props.onChange(e, data);
            });
        }

        componentDidUpdate(prevProps) {
            if (this.props.value != prevProps.value) {
                this.colorPickerWidget.setValue(this.props.value);
            }
        }

        componentWillUnmount() {
            this.colorPickerWidget.destroy();
        }

        render() {
            return (
                <div className="color-picker-component"
                    ref={el => this.el = el}>
                </div>
            );
        }

    }

    ColorPicker.propTypes = {
        value: PropTypes.string,
        onChange: PropTypes.func
    };

    return ColorPicker;

});