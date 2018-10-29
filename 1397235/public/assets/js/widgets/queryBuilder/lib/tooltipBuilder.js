/**
 * A module that builds the tooltip used in the QueryBuilder widget
 *
 * @module TooltipBuilder
 * @author Sanket Desai <sanketdesai@juniper.net>
 * @author Vidushi Gupta <vidushi@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    'widgets/tooltip/tooltipWidget',
    'lib/template_renderer/template_renderer',
    'text!widgets/queryBuilder/templates/helpContent.html',
    'widgets/queryBuilder/util/constants',
    'lib/i18n/i18n'
], /** @lends TooltipBuilder */
function (TooltipWidget, render_template, helpTemplate, CONSTANTS, i18n) {

    /**
     * TooltipBuilder constructor
     *
     * @constructor
     * @class TooltipBuilder - Builds the tooltips used in the QueryBuilder widget
     *
     * @returns {Object} Current TooltipBuilder's object: this
     */
    var TooltipBuilder = function (conf) {
        var $filterBar = conf.$container,
            minWidth = 100,
            maxWidth = 100,
            vent = conf.vent;
        var $iconContainer = !_.isUndefined($filterBar) && $filterBar.parent().find(".icon");
        var $helpContainer = !_.isUndefined($filterBar) && $filterBar.parent().find(".help");

        var tooltipConfig = {
            "minWidth": minWidth,
            "maxWidth": maxWidth,
            "position": "top-left",
            "animation": false,
            "offsetX": -6
        };

        // Render the template with the internationalization messages
        var tooltip_text = render_template(helpTemplate, {
            "info_icon_title": i18n.getMessage("info_icon_title"),
            "info_icon_example": i18n.getMessage("info_icon_example"),
            "help_filter_rule": i18n.getMessage("help_filter_rule"),
            "help_filter_example": i18n.getMessage("help_filter_example"),
            "help_comma_rule": i18n.getMessage("help_comma_rule"),
            "help_comma_example_p1": i18n.getMessage("help_comma_example_p1"),
            "help_comma_example_light": i18n.getMessage("help_comma_example_light"),
            "help_comma_example_p2": i18n.getMessage("help_comma_example_p2"),
            "help_paren_rule": i18n.getMessage("help_paren_rule"),
            "help_paren_example": i18n.getMessage("help_paren_example"),
            "help_quote_rule": i18n.getMessage("help_quote_rule"),
            "help_quote_example": i18n.getMessage("help_quote_example")
        });

        /**
         * Creates tooltip for QueryBuilder widget
         */
        var initializeTooltip = function () {
            buildIconTooltip();
            buildHelpTooltip();
        };

        /**
         * Method to build the icon tooltip. Also the tooltip is updated based on the state of the filter bar
         */
        var buildIconTooltip = function () {
            var $iconTooltip = $(tooltip_text).find(".iconTooltip");

            vent.on("query.message", function (message) {
                var showMessage = (message == CONSTANTS.validity.info) ? $iconTooltip : message;
                !_.isUndefined(tooltipWidgetIcon) && tooltipWidgetIcon.updateContent(showMessage);
            });

            var tooltipWidgetIcon = new TooltipWidget({
                "elements": tooltipConfig,
                "container": $iconContainer,
                "view": $iconTooltip
            });

            tooltipWidgetIcon.build();
        };

        /**
         * Method to build the static help tooltip.
         */
        var buildHelpTooltip = function () {

            var $helpTooltip = $(tooltip_text).find(".helpTooltip");

            var tooltipWidgetHelp = new TooltipWidget({
                "elements": tooltipConfig,
                "container": $helpContainer,
                "view": $helpTooltip
            });

            tooltipWidgetHelp.build();
        };

        initializeTooltip();

    };

    return TooltipBuilder;
});
