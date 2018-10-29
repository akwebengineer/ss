/**
 * A view that uses the colorPicker component (created from the colorPicker widget) to render a color picker using React
 *
 * @module ColorPickerReactView
 * @author Swena Gupta <gswena@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */
define([
    'react',
    'react-dom',
    'es6!widgets/colorPicker/react/colorPicker',
    'es6!widgets/colorPicker/react/tests/component/colorPickerApp'
], function (React, ReactDOM, ColorPicker, ColorPickerApp) {
    var ColorPickerReactView = function (options) {
        this.el = options.$el[0];

        this.render = function () {
            ReactDOM.render(
                <div>
                    <ColorPicker/>
                    <br/>
                    <br/>
                    <ColorPickerApp/>
                    <br/>
                </div>, this.el
            );
            return this;
        };
    };

    return ColorPickerReactView;

});