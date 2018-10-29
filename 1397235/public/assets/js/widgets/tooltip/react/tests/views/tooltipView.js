/**
 * A view that uses the tooltip component (created from the tooltip widget) to render a tooltip using React
 *
 * @module Tooltip Component View
 * @author Eva Wang <iwang@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */
define([
    'react',
    'react-dom',
    'es6!widgets/tooltip/react/tooltip',
    'es6!widgets/tooltip/react/tests/component/simpleTooltipApp',
    'es6!widgets/tooltip/react/tests/component/formTooltipApp'
], function (React, ReactDOM, Tooltip, SimpleTooltipApp, FormTooltipApp) {
    var TooltipComponentView = function (options) {
        this.el = options.$el[0];

        this.render = function () {
            //creates a React component from the tooltip component
            class TooltipApp extends React.Component {
                constructor(props) {
                    super(props);
                }

                render() {
                    return (
                        <div>
                            <ol>
                                <li>
                                    Tooltip with simple text on the link: <SimpleTooltipApp/>
                                </li>
                                <li>
                                    Tooltip with simple text on the image:
                                    <span>
                                        <svg className="ua-field-help"><use href="#icon_help"></use></svg>
                                        <Tooltip 
                                            position = "top"
                                        >
                                            <div>Test Help Tooltip</div>
                                        </Tooltip>
                                    </span>
                                </li>
                                <li>
                                    <span>
                                        Tooltip with link and image on hover over the text
                                        <Tooltip>
                                            <div>
                                                <div><span><svg className="icon_search_sm-dims"><use href="#icon_search_sm"/></svg></span> <strong>This text is in bold case</strong></div>
                                                <span>This text is in bold case </span><a href="http://www.google.com">somelink</a>
                                            </div>
                                        </Tooltip>
                                    </span>
                                </li>
                                <li>
                                    <FormTooltipApp/>
                                </li>
                                <li>
                                    <span>
                                        Trigger tooltip on click
                                        <Tooltip
                                            trigger = "click"
                                            position = "bottom"
                                        >
                                            <div>Sample tooltip on click</div>
                                        </Tooltip>
                                    </span>
                                </li>
                            </ol>
                        </div>
                    );
                }
            };

            //render React components
            ReactDOM.render(<TooltipApp />, this.el);

            return this;
        };
    };

    return TooltipComponentView;
});