/**
 * A module that implements a TimeZone React component using the TimeZone widget
 *
 * @module TimeZone
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */
define([
    'react',
    'react-dom',
    'prop-types',
    'widgets/timeZone/timeZoneWidget'
], function (React, ReactDOM, PropTypes, TimeZoneWidget) {

    class TimeZone extends React.Component {
        constructor(props) {
            super(props);
        }

        componentDidMount() {
            let {value, onChange} = this.props;
            this.$el = $(this.el);

            this.timeZoneWidget = new TimeZoneWidget({ 
                container: this.el, 
                selectedTimezone: value, 
                onChange: onChange
            }).build();
        }

        componentDidUpdate(prevProps) {
            // Has the selected timezone changed?
            if (this.props.value !== prevProps.value) {
                this.timeZoneWidget.setSelectedTimezone(this.props.value);
            }
        }

        componentWillUnmount() {
            this.timeZoneWidget.destroy();
        }

        render() {
            return (
                <div className="timezone-component"
                     ref = {el => this.el = el}>
                </div>
            );
        }
    }

    TimeZone.propTypes = {
        onChange: PropTypes.func,
        value: PropTypes.string
    };

    return TimeZone;
});