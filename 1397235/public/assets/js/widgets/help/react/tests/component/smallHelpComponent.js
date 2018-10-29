/**
 * A view that uses the help component (created from the help widget) to render a small size of help using React
 *
 * @module Small Help Component
 * @author Eva Wang <iwang@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */
define([
    'react',
    'react-dom',
    'es6!widgets/help/react/help'
], function (React, ReactDOM, HelpComp) {
    //creates a React component from the help component 
    class SmallHelpComponent extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                disabled: true
            };
            this.enable = this.enable.bind(this);
            this.disable = this.disable.bind(this);
        }

        enable() {
            this.setState({
                disabled: false
            });
        }

        disable() {
            this.setState({
                disabled: true
            });
        }

        render() {
            const Help = HelpComp.Help,
                  HelpLink = HelpComp.HelpLink;
            return (
                <div>
                    <h3>Small Size</h3>
                    <ul>
                        <li>Example 1
                            <Help
                                size="small"
                                {...this.state}
                            >
                                <div>Tooltip that shows how to access view help from the Help Widget</div>
                                <div>More HelpContent</div>
                                <HelpLink id="alias_for_ua_event_binding">More...</HelpLink>
                            </Help>
                        </li>
                        <li>Example 2
                            <Help
                                size="small"
                                {...this.state}
                            >
                                This is an inline help example for element 1
                            </Help>
                        </li>
                    </ul>
                    <div>
                        <span className="slipstream-primary-button" onClick={this.enable}>Enable Small Help</span>
                        <span className="slipstream-primary-button" onClick={this.disable}>Disable Small Help</span>
                    </div>
                </div>
            );
        }
    };

    return SmallHelpComponent;
});