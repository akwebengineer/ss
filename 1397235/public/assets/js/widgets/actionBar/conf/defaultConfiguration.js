/**
 * A module that sets default configurations for the Action Bar widget
 *
 * @module defaultConfiguration
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */
define(function () {

    var defaultConfiguration = {};

    defaultConfiguration.tooltip = {
        "maxWidth": 300,
        "position": 'top'
    };

    defaultConfiguration.commonProperties = {
        "action": ["menu_type", "button_type", "icon_type", "label", "key", "disabledStatus", "icon"],
        "icon": ["icon"]
    };

    return defaultConfiguration;
});