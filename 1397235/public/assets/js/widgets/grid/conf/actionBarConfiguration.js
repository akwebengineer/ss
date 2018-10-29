/**
 * A  configuration object with the default parameters required to build an actionBar widget in the Grid widget
 *
 * @module actionBarConfiguration
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */

define([], function () {

    var actionBarConfiguration = {};

    actionBarConfiguration.actionType = ["menu_type", "button_type", "icon_type"];

    actionBarConfiguration.defaultActions = {
        "edit": {
            "label": "Edit",
            "key": "editOnRowHover",
            "icon": {
                "default": {
                    "icon_url": "#icon_edit_blue_14x14",
                    "icon_class": "icon_edit_blue_14x14-dims"
                }
            }
        },
        "delete": {
            "label": "Delete",
            "key": "deleteOnRowHover",
            "icon": {
                "default": {
                    "icon_url": "#icon_remove_blue_14x14",
                    "icon_class": "icon_remove_blue_14x14-dims"
                }
            }
        }
    };

    actionBarConfiguration.moreMenuRow = {
        "menu_type": true,
        "hover": true,
        "icon": {
            "default": {
                "icon_url": "#icon_row_menu",
                "icon_class": "icon_row_menu-dims",
                "icon_color": "icon_row_menu-default"
            },
            "hover": "icon_row_menu-hover"
        },
        "key": "moreMenuRow"
    };

    return actionBarConfiguration;

});
