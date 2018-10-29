/**
 * A module with partial sets of grid configuration for the grid widget
 *
 * @module PartialConfigurationSample
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */
define(function () {
    var partialConfigurationSample = {};

    partialConfigurationSample.rowHoverMenu = {
        "defaultButtons": { //overwrite default CRUD grid buttons
            "delete": true,
            "edit": false
        },
        "customButtons": [
            {
                "button_type": true,
                "label": "Publish",
                "key": "publishGrid"
            },
            {
                "button_type": true,
                "label": "Publish",
                "key": "publishGrid1",
                "disabledStatus": true
            },
            {
                "icon_type": true,
                "label": "Expand",
                "icon": {
                    "default": "icon_expand_all",
                    "hover": "icon_expand_all_hover",
                    "disabled": "icon_expand_all_disable"
                },
                "key": "expandAll"
            },
            {
                "icon_type": true,
                "label": "Expand",
                "icon": "icon_expand_all",
                "key": "expandAll1",
                "disabledStatus": true
            },
            {
                "menu_type": true,
                "label": "Grids on Overlay",
                "key": "subMenu",
                "disabledStatus": true, //default status is false //to be supported
                "items": [
                    {
                        "label": "Large grid",
                        "key": "subMenu1"
                    },
                    {
                        "label": "Small grid",
                        "key": "subMenu2",
                        "disabledStatus": true
                    }
                ]
            },
            {
                "label": "Clone",
                "key": "testCloneHover",
                "icon": "icon_clone_blue"
            },
            {
                "button_type": true,
                "label": "Clone",
                "key": "testButtonCloneHover"
            }
        ]
    };

    partialConfigurationSample.actionColumn = {
        "index": "action",
        "name": "action",
        "label": "Action",
        "width": 150,
        "group": "test-sequence",
        "editCell": {
            "type": "dropdown",
            "values": [
                {
                    "label": "Permit",
                    "value": "permit"
                },
                {
                    "label": "Deny",
                    "value": "deny"
                }
            ]
        }
    };

    return partialConfigurationSample;
});