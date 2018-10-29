/**
 * A view that uses the help component (created from the help widget) to render a help using React
 *
 * @module Help Component
 * @author Eva Wang <iwang@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */
define([
    'react',
    'react-dom',
    'es6!widgets/help/react/help',
    'es6!widgets/help/react/tests/component/smallHelpComponent'
], function (React, ReactDOM, HelpComp, SmallHelpComponent) {
    var HelpComponent = function (options) {

        this.el = options.$el[0];

        this.render = function () {
            //creates a React component from the help component 
            class HelpApp extends React.Component {
                constructor(props) {
                    super(props);
                }

                render() {
                    const Help = HelpComp.Help,
                          HelpLink = HelpComp.HelpLink;
                    return (
                        <div>
                            <h3>Defaul Size</h3>
                            <ul>
                                <li>Example 1
                                    <Help>
                                        Tooltip that shows how to access view help from the Help Widget
                                        <HelpLink id="alias_for_ua_event_binding"><b>More...</b></HelpLink>
                                    </Help>
                                </li>
                                <li>Example 2
                                    <Help>
                                        This is an inline help example for example 2
                                    </Help>
                                </li>
                            </ul> 
                            <SmallHelpComponent/>                           
                        </div>
                    );
                }
            };

            //render React components
            ReactDOM.render(<HelpApp />, this.el);

            return this;
        };
    };

    return HelpComponent;
});