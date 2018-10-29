/**
 * A module that builds a Help React component using the help widget
 *
 * @module Help Component
 * @author Eva Wang <iwang@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */
define([
    'react',
    'react-dom',
    'prop-types',
    'widgets/help/helpWidget'
], function (React, ReactDOM, PropTypes, HelpWidget) {

    class Help extends React.Component {
        constructor(props) {
            super(props);
        }

        componentDidMount() {                
            var self = this,
                link = this.getProp(this.props.children, 'HelpLink'), 
                size = this.props.size,
                view = document.createElement("div"),
                text, linkId, linkView;

            if (link.length){
                text = link[0].children;
                linkId = link[0].id;
                linkView = document.createElement("div");
                ReactDOM.render(text, linkView);
            } 

            ReactDOM.render(this.props.children, view, function () {
                let config = {
                    "content": view.innerHTML
                };
                if (link.length){
                    config["ua-help-text"] = linkView.innerHTML;
                    config["ua-help-identifier"] = linkId;
                }
                self.helpWidget = new HelpWidget({
                    container: self.el,
                    view: config,
                    size: size
                }).build();

                self.props.disabled && self.helpWidget.disable();
            });
        }

        getProp(children, componentName) {
            return React.Children.map(children, child => {
                if (child.type && child.type.displayName == componentName) {
                    return child.props;
                }
            });
        }

        componentWillReceiveProps(nextProps) {
            if (nextProps.disabled === false) {
                this.helpWidget.enable();
            }else if(nextProps.disabled === true){
                this.helpWidget.disable();
            }
        }

        componentWillUnmount() {
            this.helpWidget.destroy();
        }

        render() {
            return (
                <span className="help-component"
                     ref={el => this.el = el}>
                </span>
            );
        }
    }

    Help.propTypes = {
        "size": PropTypes.string,
        "disabled": PropTypes.bool
    };
    
    const HelpLink = (props) => {
        return null;
    };
    
    HelpLink.propTypes = {
        "id": PropTypes.string
    };
    HelpLink.displayName = "HelpLink";

    return {
        Help: Help,
        HelpLink: HelpLink
    };
});