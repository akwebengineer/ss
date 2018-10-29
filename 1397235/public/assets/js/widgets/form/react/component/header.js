/**
 * A stateful React component that creates a header in a form. It is composed by Title, Info and Error components.
 *
 * @module Header
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */
define([
    'react',
    'react-dom',
    'es6!widgets/form/react/component/common/info',
    'es6!widgets/form/react/lib/util'
], function (React, ReactDOM, Info, Util) {

    class Header extends React.Component {
        render() {
            const {children} = this.props;
            return (
                <React.Fragment>
                    {Util.getComponentsByName(children, "HeaderTitle")}
                    <div className={this.props.disclosure ? `progressive_disclosure_content ${this.props.disclosure}` : ""}>
                        {Util.getComponentsNotInName(children, "HeaderTitle")}
                    </div>
                </React.Fragment>
            );
        }
    }
    Header.displayName = "Header";

    Header.Title = (props) => {
        return (
            <div className="slipstream-content-title">
                {props.children}
            </div>
        );
    };
    Header.Title.displayName = "HeaderTitle";

    Header.Info = (props) => {
        return (
            <Info className={props.className}>
                {props.children}
            </Info>
        );
    };
    Header.Title.displayName = "HeaderInfo";

    Header.Error = (props) => {
        return (
            <Info className={props.className} errorType={true}>
                {props.children}
            </Info>
        );
    };
    Header.Title.displayName = "HeaderError";

    return Header;

});