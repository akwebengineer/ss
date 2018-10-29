/**
 * A module that creates a base class with the library references required to test a widget
 *
 * @module BaseWidgetTest
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */
define([], /** @lends BaseWidgetTest*/ function () {

    var BaseWidgetTest = function () {
        /**
         * BaseWidgetTest constructor
         *
         * @constructor
         * @class BaseWidgetTest- Builds a BaseWidgetTest for testing a widget
         * @returns {Object} Current BaseWidgetTest's object: this
         */

        /**
         * Initializes the base widget test
         */
        this.init = function (callback) {
            require.config({
                baseUrl: "/assets/js/",
                paths: {
                    "text": "vendor/require/text"
                },
                config: {
                    "es6": {
                        "modules": undefined
                    }
                }
            });
            require([
                "text!conf/requireConf.json",
                "text!/assets/images/icon-inline-sprite.svg"
            ], function (requireConfig, sprite) {
                require.config(JSON.parse(requireConfig));
                require([
                    "jquery",
                    "jqSvgdom",//jquery-svg polyfill
                    "foundation.core",
                    "underscore"
                ], function ($) {
                    $(document).foundation();
                    $("body").append(sprite);
                    callback();
                });
            });
        };

    };

    return BaseWidgetTest;
});