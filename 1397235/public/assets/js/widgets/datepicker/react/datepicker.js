/**
 * A module that builds a Datepicker React component using the Datepicker widget
 * The configuration is included as a part of the Datepicker element properties and the container is the same where the Datepicker is added
 *
 * @module DatepickerWidget
 * @author Vidushi Gupta <vidushi@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */
define([
    'react',
    'react-dom',
    'prop-types',
    'widgets/datepicker/datepickerWidget'
], function (React, ReactDOM, PropTypes, DatepickerWidget) {

    class Datepicker extends React.Component {

        componentDidMount() {
            this.$el = $(this.el);
            this.datepickerWidget = new DatepickerWidget(_.extend({
                    container: this.el
                }, this.props
            )).build();

            if (!_.isUndefined(this.props.value)) {
                this.datepickerWidget.setDate(this.props.value);
            }

            if (!_.isUndefined(this.props.disabled)) {
                this.datepickerWidget.disable(this.props.disabled);
            }

            if (!_.isUndefined(this.props.minDate)) {
                this.datepickerWidget.minDate(this.props.minDate);
            }
            
            if (!_.isUndefined(this.props.maxDate)) {
                this.datepickerWidget.maxDate(this.props.maxDate);
            }
        }

        componentDidUpdate(prevProps) {
            if (this.props.disabled !== prevProps.disabled) {
                this.datepickerWidget.disable(this.props.disabled);
            }

            if (this.props.value !== prevProps.value) {
                this.datepickerWidget.setDate(this.props.value);
                this.props.onChange && this.props.onChange(this.datepickerWidget.getDate());
            }

            if (this.props.minDate !== prevProps.minDate) {
                this.datepickerWidget.minDate(this.props.minDate);
            }

            if (this.props.maxDate !== prevProps.maxDate) {
                this.datepickerWidget.maxDate(this.props.maxDate);
            }
        }

        componentWillUnmount() {
            this.datepickerWidget.destroy();
        }

        render() {
            return (
                <input type="text" data-widget="datepicker"
                       className="datepicker-component"
                       id={this.props.id}
                       ref={el => this.el = el}>
                </input>
            );
        }
    }

    Datepicker.propTypes = {
        id: PropTypes.string,
        disabled: PropTypes.bool,
        value: PropTypes.instanceOf(Date),
        minDate: PropTypes.instanceOf(Date),
        maxDate: PropTypes.instanceOf(Date),
        onChange: PropTypes.func
    };

    return Datepicker;
});