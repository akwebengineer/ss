/**
 * A tooltip component contains a form
 *
 * @module FormTooltipApp
 * @author Eva Wang <iwang@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */
define([
    'react',
    'react-dom',
    'es6!widgets/tooltip/react/tooltip'
], function (React, ReactDOM, Tooltip) {

    class FormTooltipApp extends React.Component {

        constructor(props) {
            super(props);
            this.state = {
                interactive: true,
                minWidth: 200
            };
        }

        render() {
            return (
                <span>
                    Tooltip with form on hover over the text
                    <Tooltip
                        interactive = {this.state.interactive}
                        minWidth = {this.state.minWidth}
                    >
                        <form className="form-pattern">
                            <div className="slipstream-content-title">
                                    Sample Form Widget
                            </div>
                            <div className="section_content ">
                                <div className="row">
                                    <div className="elementlabel left">
                                        <label htmlFor="text_url_s_v" className="left inline">
                                            Text url
                                        </label>
                                    </div>
                                     <div className="elementinput left">
                                        <input type="url" data-validation="url" id="text_url_s_v" name="text_url_s_v" placeholder="http://www.juniper.net"></input>
                                    </div>
                                </div>                    
                            </div>
                        </form>
                    </Tooltip>
                </span>
            );
        }

    }

    return FormTooltipApp;

});