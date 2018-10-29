/**
 * A module that builds a Search React component using the Search widget
 * The configuration is recieved as Search component properties and the container is the same where the element is added
 *
 * @module SearchWidget
 * @author Vidushi Gupta <vidushi@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */
define([
    'react',
    'react-dom',
    'prop-types',
    'widgets/search/searchWidget'
], function (React, ReactDOM, PropTypes, SearchWidget) {

    class Search extends React.Component {

        componentDidMount() {
            this.$el = $(this.el);
            let {tokens, logicMenu, onChange} = this.props;
            let events = {onChange};

            this.searchWidget = new SearchWidget({
                readOnly: true,
                logicMenu: logicMenu,
                container: this.el
            }).build();

            if (_.isArray(tokens)) {
                // If tokens are defined at the time of component creation, add them to widget
                this.searchWidget.addTokens(tokens);
            }

            this.bindEvents(events);
        }

        //Used to bind events related to search container
        bindEvents(events) {
            if (events.onChange) {
                this.$el.find("div.search-widget").on("slipstreamSearch:onChange", (e, data) => {
                    events.onChange(data.tokens);
                });
            }
        }

        // Method to compare two arrays to be identical, also tests for mismatched indexes.
        isDifferent(arr1, arr2) {
            return (arr1.slice().sort().toString() != arr2.slice().sort().toString());
        }

        componentDidUpdate(prevProps) {
            if (this.isDifferent(this.props.tokens, prevProps.tokens)) {
                this.searchWidget.removeAllTokens(true);
                this.searchWidget.addTokens(this.props.tokens);
            }
        }

        componentWillUnmount() {
            this.searchWidget.destroy();
        }

        render() {
            return (
                <div className="search-component"
                     ref={el => this.el = el}>
                </div>
            );
        }
    }

    Search.defaultProps = {
        logicMenu: ['OR']
    };

    Search.propTypes = {
        readOnly: PropTypes.bool,
        logicMenu: PropTypes.array,
        tokens: PropTypes.array,
        onChange: PropTypes.func
    };

    return Search;
});