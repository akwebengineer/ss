/**
 * A component that generates the content for a tooltip from a set of configuration properties
 *
 * @module SimpleTooltipApp
 * @author Eva Wang <iwang@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */
define([
    'react',
    'react-dom',
    'es6!widgets/tooltip/react/tooltip',
    'es6!widgets/slider/react/tests/component/sliderApp'
], function (React, ReactDOM, Tooltip, SliderApp) {

    class SimpleTooltipApp extends React.Component {

        constructor(props) {
            super(props);
            
            this.state = {
                disabled: false,
                content : "This is my link's tooltip message!",
                className: ""
            };
            this.enable = this.enable.bind(this);
            this.disable = this.disable.bind(this);
            this.updateContent = this.updateContent.bind(this);
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

        updateContent(){
            this.setState({
                content: "This is new content!",
                className: "slipstream-primary-button"
            });
        }

        render() {
            return (
                <span>
                    <a href="http://google.com" id="testLink"> Test of a link 
                        <Tooltip
                            {...this.state}
                            position = "top"
                        >
                            <div>{this.state.content}</div>
                            <div className = {this.state.className}>More content</div>
                            <SliderApp/>
                        </Tooltip>
                    </a>
                    <div>
                        <span className="slipstream-primary-button" onClick={this.enable}>Enable #1</span>
                        <span className="slipstream-primary-button" onClick={this.disable}>Disable #1</span>
                        <span className="slipstream-primary-button" onClick={this.updateContent}>Update Content #1</span>
                    </div>
                </span>
            );
        }
    }

    return SimpleTooltipApp;

});