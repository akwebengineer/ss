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
    'es6!widgets/overlay/react/tests/component/contentApp'
], function (React, ReactDOM, Overlay, ContentApp) {

    var ConfigurableOverlayView = function (options) {
        this.el = document.createElement("div");

        this.render = function() {
            ReactDOM.render(
                <Overlay {...options.overlayConfiguration} >
                    <ContentApp {...options.contentConfiguration}/>
                </Overlay>
                , this.el);
        };

    };

    return ConfigurableOverlayView;

});