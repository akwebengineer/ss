/**
 * A stateful React component that creates a footer in a form. It is composed by Action and Info components.
 *
 * @module Footer
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */
define([
    'react',
    'es6!widgets/form/react/lib/util'
], function (React, Util) {

    class Footer extends React.Component {
        render() {
            const {children} = this.props;
            return (
                <React.Fragment>
                    {Util.getComponentsByName(children, "FooterAction")}
                    {Util.getComponentsByName(children, "FooterInfo")}
                </React.Fragment>
            )
        }
    }
    Footer.displayName = "Footer";

    Footer.Action = (props) => {
        return (
            <div
                className={`row slipstream-buttons-wrapper buttons ${props.className}`}
            >
                {!props.unlabeled && <div className="elementlabel left"></div>}
                <div
                    className={props.alignedRight ? " buttonsAlignedRight" : "left"}
                >
                    {props.children}
                </div>
            </div>
        )
    };
    Footer.Action.displayName = "FooterAction";

    Footer.Info = (props) => {
        return (
            <div className="row slipstream-footer-wrapper">
                {props.children}
            </div>
        )
    };
    Footer.Info.displayName = "FooterInfo";

    return Footer;

});