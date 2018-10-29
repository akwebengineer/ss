/**
 * A module that builds a help widget from a configuration object.
 * The configuration object includes the container which should be used to render the widget
 *
 * @module HelpWidget
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */
define([
    "lib/template_renderer/template_renderer",
    "text!widgets/help/templates/helpContainer.html",
    "text!widgets/help/templates/hoverTooltip.html",
    "widgets/tooltip/tooltipWidget",
    "widgets/help/conf/tooltipConfiguration"
], /** @lends HelpWidget*/
function (render_template, helpContainer, hoverTooltip, TooltipWidget, tooltipConfiguration) {

    var HelpWidget = function (conf) {
        /**
         * HelpWidget constructor
         *
         * @constructor
         * @class HelpWidget- Builds a help widget from a configuration object.
         * @param {Object} conf - It requires the container and the id parameters. The help widget can be added to a specific element (when the *view* attribute is included) or it can be added to multiple elements.
         * @param {Object} conf.container - DOM element that defines the container where the widget will be rendered.
         * @param {Object} conf.view - defines help tooltip content and help identifier. It has the attributes:  content, ua-help-text and ua-help-identifier
         * @param {string} conf.view.content - Required property, it contains the help text that will be shown on the help tooltip.
         * @param {string} conf.view.ua-help-text - Optional property, it contains the help text that will be be used as a link to an external help page.
         * @param {string} conf.view.ua-help-identifier - Optional property, it represents the link identifier to link to an external help page.
         * @returns {Object} Current HelpWidget's object: this
         */

        var $helpContainer = $(conf.container),
            hasRequiredConfiguration = _.isObject(conf) && !_.isUndefined(conf.container),
            helpBuilt = false,
            errorMessages = {
                "noConf": "The configuration object for the help widget is missing",
                "noContainer": "The configuration for the help widget must include the container property",
                "noBuilt": "The help widget was not built"
            },
            tooltipInstance;

        /**
         * Throws error messages if some required properties of the configuration are not available
         * @inner
         */
        var showError = function () {
            if (!_.isObject(conf))
                throw new Error(errorMessages.noConf);
            else if (_.isUndefined(conf.container))
                throw new Error(errorMessages.noContainer);
            else //generic error
                throw new Error(errorMessages.noBuilt);
        };

        /**
         * Builds the help widget in the specified container.  The help widget can be added to a specific element (when the view attribute is included) or it can be added to multiple elements (elements with the data-help-widget attribute) .
         * @returns {Object} returns the instance of the help widget that was built
         */
        this.build = function () {
            if (hasRequiredConfiguration) {
                var helpTooltipConfiguration;
                if (conf.view) {
                    helpTooltipConfiguration = getViewHelpTooltipConfiguration();
                } else {
                    helpTooltipConfiguration = getInlineHelpTooltipConfiguration();
                }
                tooltipInstance = new TooltipWidget(_.extend(helpTooltipConfiguration, {
                    "elements": tooltipConfiguration
                })).build();
                helpBuilt = true;
            } else {
                showError();
            }
            return this;
        };

        /**
         * Gets the tooltip configuration for a tooltip with view (html) content
         * @param {Object} help - object that will have configuration parameter for help
         * @inner
         */
        var getViewHelpTooltipConfiguration = function () {
            var getTooltipView = function (tooltipViewConf) {
                var tooltipView = render_template(hoverTooltip, tooltipViewConf);
                return tooltipView;
            };
            if (conf.size && conf.size == 'small') {
                _.extend(conf.view, {smallSize: true});
            }
            $helpContainer = $helpContainer.append(render_template(helpContainer, conf.view)).find(".help-widget");
            var configuration = {
                "container": $helpContainer.find(".ua-field-help"),
                "view": getTooltipView(conf.view)
            };
            return configuration;
        };

        /**
         * Gets the tooltip configuration for a tooltip with string content
         * @inner
         */
        var getInlineHelpTooltipConfiguration = function () {
            var $inlineHelpContainer;
            $helpContainer.find("[data-help-widget]").each(function () {
                $inlineHelpContainer = $(this);
                $inlineHelpContainer.append(render_template(helpContainer, {
                    "content": $inlineHelpContainer.data("help-widget"),
                    "ua-help-identifier": $inlineHelpContainer.data("ua-id"),
                    "isInlineHelp": true,
                    "smallSize": conf.size == 'small' ? true : false
                }))
            });
            var configuration = {
                "container": $helpContainer,
                "elements": tooltipConfiguration
            };
            $helpContainer = $helpContainer.find(".help-widget");
            return configuration;
        };

        /**
         * Enables the help tooltip of the widget to be able to open
         */
        this.enable = function () {
            if (helpBuilt) {
                $helpContainer.find(".tooltipstered").removeClass("disabled");
                tooltipInstance && tooltipInstance.enable();
            } else {
                throw new Error(errorMessages.noBuilt);
            }
        };

        /**
         * Disables the help tooltip of the widget from being able to open
         */
        this.disable = function () {
            if (helpBuilt) {
                $helpContainer.find(".tooltipstered").addClass("disabled");
                tooltipInstance && tooltipInstance.disable();
            } else {
                throw new Error(errorMessages.noBuilt);
            }
        };

        /**
         * Clean up the specified container from the resources created by the help widget
         * @returns {Object} returns the instance of the help widget
         */
        this.destroy = function () {
            if (helpBuilt) {
                $helpContainer.remove();
            } else {
                throw new Error(errorMessages.noBuilt);
            }
            return this;
        };

    };

    return HelpWidget;
});