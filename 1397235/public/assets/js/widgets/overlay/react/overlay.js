/**
 * A module that builds an Overlay component using the Overlay widget
 * The configuration is included as a part of the Overlay element properties and the content of the Overlay is the children of the Overlay
 *
 * @module Overlay
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */
define([
    'react',
    'react-dom',
    'prop-types',
    'widgets/overlay/overlayWidget'
], function (React, ReactDOM, PropTypes, OverlayWidget) {

    class Overlay extends React.Component {

        constructor(props) {
            super(props);
        }

        componentDidMount() {
            let {children, ...overlayConfiguration} = this.props,
                overlayContent = this.props.children,
                el = document.createElement("div");

            ReactDOM.render(overlayContent, el, function () {
                let ContentView = Backbone.View.extend({
                    el: el,
                    render: function () {
                        return this;
                    }
                });
                this.overlayWidget = new OverlayWidget({
                    ...overlayConfiguration,
                    view: new ContentView()
                }).build();
            });
        }

        componentWillUnmount() {
            this.overlayWidget.destroy();
        }

        render() {
            return null;
        }
    }

    Overlay.propTypes = {
        type: PropTypes.string,
        class: PropTypes.string,
        title: PropTypes.string,
        titleHelp: PropTypes.shape({
            "content": PropTypes.string,
            "ua-help-identifier": PropTypes.string,
            "ua-help-text": PropTypes.string
        }),
        cancelButton: PropTypes.bool,
        okButton: PropTypes.bool,
        showBottombar: PropTypes.bool,
        height: PropTypes.string,
        width: PropTypes.string,
        beforeCancel: PropTypes.func,
        cancel: PropTypes.func,
        beforeSubmit: PropTypes.func,
        submit: PropTypes.func
    };

    return Overlay;

});