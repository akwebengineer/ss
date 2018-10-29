/**
 * A view that uses the Overlay component (created from the Overlay widget) to render an overlay using React
 *
 * @module OverlayComponent View
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */
define([
    'react',
    'react-dom',
    'es6!widgets/overlay/react/overlay',
], function (React, ReactDOM, Overlay) {

    var BasicOverlayView = function () {
        this.el = document.createElement("div");

        this.render = function () {
            ReactDOM.render(
                <Overlay
                    title="Overlay Title"
                    type="large"
                    okButton={true}
                >
                    <div>Container that represents any content and could include other React components</div>
                </Overlay>
                , this.el);
        };

    };

    return BasicOverlayView;

});