/**
 * A module that builds a Tooltip React component using the Tooltip widget
 *
 * @module Tooltip Component
 * @author Eva Wang <iwang@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */
define([
    'react',
    'react-dom',
    'prop-types',
    'widgets/tooltip/tooltipWidget'
], function (React, ReactDOM, PropTypes, TooltipWidget) {

    class Tooltip extends React.Component {
        constructor(props) {
            super(props);
            this.view = document.createElement("div");
        }

        componentDidMount() {
            var $el = $(this.el),
                self = this;
            
            let {children, ...tooltipConfiguration} = this.props;

            ReactDOM.render(children, this.view, function () {
                self.tooltipWidget = new TooltipWidget({
                    container: $el.parent(),
                    elements: tooltipConfiguration,
                    view: self.view
                }).build();
            });
        }

        componentWillReceiveProps(nextProps) {
            var self = this;
            if (nextProps.disabled !== this.props.disabled){
                if (nextProps.disabled === false) {
                    this.tooltipWidget.enable();
                }else if(nextProps.disabled === true ){
                    this.tooltipWidget.disable();
                }
            }else{
                //After any state updates, re-render the content of tooltip and use updatedContent method to update the tooltip content.
                ReactDOM.render(nextProps.children, this.view, function () {
                    self.tooltipWidget.updateContent($(self.view));
                });
            }
        }

        componentWillUnmount() {
            this.tooltipWidget.destroy();
        }

        render() {
            return (
                <span className="tooltip-component"
                     ref={el => this.el = el}>
                </span>
            );
        }
    }

    Tooltip.propTypes = {
        minWidth: PropTypes.number,
        maxHeight: PropTypes.number,
        offsetX: PropTypes.number,
        offsetY: PropTypes.number,
        functionBefore: PropTypes.func,
        functionReady: PropTypes.func,
        position: PropTypes.string,
        interactive: PropTypes.bool,
        disabled: PropTypes.bool,
        trigger: PropTypes.string,
        onlyOne: PropTypes.bool,
        contentCloning: PropTypes.bool
    };

    return Tooltip;
});