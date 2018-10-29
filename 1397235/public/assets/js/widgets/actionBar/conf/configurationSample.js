/**
 * A module with the actionBar configuration for the actionBar widget
 *
 * @module ActionBarConfiguration
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */
define(function () {
    var actionBarConfiguration = {};

    actionBarConfiguration.grid = [
        {
            "separator_type": true
        },
        {
            "menu_type": true,
            "label": "Filter",
            "key": "filterMenu",
            "items": [ //to be supported
                {
                    "label": "Last",
                    "key": "subMenu1"
                },
                {
                    "label": "Previous",
                    "key": "subMenu2"
                },
                {
                    "separator": "true"
                },
                {
                    "label": "All",
                    "key": "subMenu4"
                }
            ],
            // "statusCallback": setCustomMenuStatusSplit //to be supported
        },
        {
            "separator_type": true
        },
        {
            "menu_type": true,
            "label": "View",
            "key": "viewMenu",
            "items": [
                {
                    "label": "Card",
                    "key": "subMenu1"
                },
                {
                    "label": "Carousel",
                    "key": "subMenu2"
                },
                {
                    "label": "Grid",
                    "key": "subMenu3"
                }
            ]
        },
        {
            "separator_type": true
        },
        {
            "search_type": true,
            "key": "searchAction"
        },
        {
            "menu_type": true,
            "key": "filterAction",
            "label": "Filter",
            "icon": {
                "default": {
                    "icon_url": "#icon_filter_menu",
                    "icon_class": "icon_filter_menu-dims",
                }
            },
            "items": [
                {
                    "label": "Filter: Edit",
                    "key": "filterEdit"
                },
                {
                    "label": "Filter: Duplicate",
                    "key": "filterDuplicate"
                },
                {
                    "label": "Filter: Disable",
                    "key": "filterDisable"
                },
                {
                    "label": "Filter: Group",
                    "key": "filterGroup"
                },
                {
                    "label": "Filter: Delete",
                    "key": "filterDelete"
                },
                {
                    "label": "Filter: Print",
                    "key": "filterPrint"
                }
            ]
        }
    ];

    var checkboxChangeEvent = {
        change: function (e) {
            console.log("Is checked?: " + this.checked + " value: " + this.value);
        }
    };

    actionBarConfiguration.button = [
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
                },
                {
                    "label": "Empty grid",
                    "key": "subMenu3"
                },
                {
                    "separator": "true"
                },
                {
                    "label": "Add row",
                    "key": "subMenu4"
                }
            ]
        },
        {
            "menu_type": true,
            "label": "Restricted",
            "key": "restrictedSubMenu",
            // "disabledStatus": true, //default status is false //to be supported
            "items": [
                {
                    "label": "Large grid",
                    "key": "restrictedSubMenu1",
                    "capabilities": ['disable']
                },
                {
                    "label": "Small grid",
                    "key": "restrictedSubMenu2",
                    "capabilities": ['disable'],
                    "disabledStatus": true
                }
            ],
        },
        {
            "menu_type": true,
            "label": "Restricted",
            "key": "restrictedSubMenuIcon",
            "disabledStatus": true, //default status is false //to be supported
            "icon": {
                "default": {
                    "icon_url": "#icon_collapse_all",
                    "icon_class": "icon_collapse_all-dims",
                    "icon_color": "icon_collapse_all_test"//optional, value is a class intended to override default icon color
                },
                "hover": "icon_collapse_all_hover_test",
                "disabled": "icon_collapse_all_disable_test"
            },
            "items": [
                {
                    "label": "Large grid",
                    "key": "restrictedSubMenuIcon1",
                    "capabilities": ['disable']
                },
                {
                    "label": "Small grid",
                    "key": "restrictedSubMenuIcon2",
                    "capabilities": ['disable']
                }
            ],
        },
        {
            "button_type": true,
            "label": "Publish",
            "key": "publishGrid",
            "disabledStatus": true
        },
        {
            "button_type": true,
            "label": "Download JIMS",
            "key": "downloadJims",
            "secondary": true
        },
        {
            "separator_type": true
        },
        {
            "icon_type": true,
            "label": "Expand",
            "icon": {
                "default": {
                    icon_url: "#icon_expand_all",
                    icon_class: "icon_expand_all-dims"
                }
            },
            "key": "expandAll",
            // "capabilities": ['disable']
        },
        {
            "icon_type": true,
            "label": "Expand",
            "icon": {
                "default": "icon_expand_all",
                "hover": "icon_expand_all_hover",
                "disabled": "icon_expand_all_disable"
            },
            "key": "expandAllRestricted",
            "capabilities": ['disable']
        },
        {
            "icon_type": true,
            "label": "Collapse",
            "icon": {
                "default": {
                    icon_url: "#icon_collapse_all",
                    icon_class: "icon_collapse_all-dims"
                }
            },
            "key": "collapseAll",
            "disabledStatus": true
        },
        {
            "icon_type": true,
            "label": "Purge",
            "icon": {
                "default": "icon_archive_purge-bg",
                "hover": "icon_archive_purge_hover-bg",
                "disabled": "icon_archive_purge_disabled-bg"
            },
            "key": "archive_purge",
            "disabledStatus": true,
            "capabilities": ['create']
        },
        {
            "separator_type": true
        },
        {
            "search_type": true,
            "key": "searchAction",
            "searchOnEnter": false
        },
        {
            "menu_type": true,
            "icon": {
                "default": {
                    "icon_url": "#icon_row_menu",
                    "icon_class": "icon_row_menu-dims",
                    "icon_color": "icon_row_menu-default"
                },
                "hover": "icon_row_menu-hover"
            },
            "key": "rowMore",
            // "disabledStatus": true, //default status is false
            "items": [
                {
                    "label": "Edit",
                    "key": "rowMoreEdit",
                    "capabilities": ['create']
                },
                {
                    "label": "Duplicate",
                    "key": "rowMoreDuplicate",
                    "capabilities": ['create']
                },
                {
                    "separator": true
                },
                {
                    "label": "Add Above",
                    "key": "rowMoreAddAbove",
                    "capabilities": ['create']
                },
                {
                    "label": "Add Below",
                    "key": "rowMoreAddBelow",
                    "disabledStatus": true, //default status is false
                    "capabilities": ['create']
                }
            ]
        },
        {
            "menu_type": true,
            "icon": {
                "default": {
                    "icon_url": "#icon_row_menu",
                    "icon_class": "icon_row_menu-dims"
                },
                // "hover": "icon_row_menu-hover"
            },
            "hover": true,
            "key": "rowMoreHover",
            // "disabledStatus": true, //default status is false
            "items": [
                {
                    "label": "Edit",
                    "key": "rowMoreHoverEdit",
                    "capabilities": ['create']
                },
                {
                    "label": "Duplicate",
                    "key": "rowMoreHoverDuplicate",
                    "capabilities": ['create']
                },
                {
                    "separator": true
                },
                {
                    "label": "Add Above",
                    "key": "rowMoreHoverAddAbove",
                    "capabilities": ['update']
                },
                {
                    "label": "Add Below",
                    "key": "rowMoreHoverAddBelow",
                    // "disabledStatus": true //default status is false
                }
            ]
        },
        {
            "menu_type": true,
            "icon": {
                "default": {
                    "icon_url": "#icon_filter_menu",
                    "icon_class": "icon_filter_menu-dims",
                }
            },
            "label": "More",
            "key": "barMore",
            "items": [
                {
                    "label": "Edit",
                    "key": "barMoreEdit"
                },
                {
                    "label": "Duplicate",
                    "key": "barMoreDuplicate",
                    "disabledStatus": true
                },
                {
                    "label": "Disable",
                    "key": "barMoreDisable",
                    "capabilities": ['disable']
                },
                {
                    "label": "Group",
                    "key": "barMoreGroup"
                },
                {
                    "label": "Delete",
                    "key": "barMoreDelete"
                },
                {
                    "label": "Print",
                    "key": "barMorePrint"
                },
                {
                    "separator": true
                },
                {
                    "title": "Checkbox",
                    "className": "checkboxTitle1"
                },
                {
                    "key": "column1",
                    "label": "Column 1",
                    "type": "checkbox",
                    "selected": true,
                    "value": '1',
                    "events": checkboxChangeEvent
                },
                {
                    "key": "column2",
                    "label": "Column 2",
                    "type": "checkbox",
                    "selected": true,
                    "events": checkboxChangeEvent
                },
                {
                    "separator": true
                },
                {
                    "title": "Radio Button"
                },
                {
                    "key": "radio1",
                    "label": "Radio 1",
                    "type": "radio",
                    "groupId": 'radio',
                    "value": '1'
                },
                {
                    "key": "radio2",
                    "label": "Radio 2",
                    "type": "radio",
                    "groupId": 'radio',
                    "value": '2'
                },
                {
                    "key": "radio2",
                    "label": "Radio 2",
                    "type": "radio",
                    "groupId": 'radio',
                    "value": '2'
                },
                {
                    "separator": true
                },
                {
                    "label": "Menu with submenu",
                    "key": "subMenus",
                    "items": [
                        {
                            "label": "Large grid",
                            "key": "subMenusSubMenu1"
                        },
                        {
                            "label": "Small grid",
                            "key": "subMenusSubMenu2"
                        },
                        {
                            "label": "Empty grid",
                            "key": "subMenusSubMenu3"
                        },
                        {
                            "separator": "true"
                        },
                        {
                            "label": "Delete rows with reset",
                            "key": "deleteRows",
                            "disabledStatus": true
                        },
                        {
                            "label": "Delete rows w/o reset",
                            "key": "deleteRowsWithoutReset",
                            "disabledStatus": true
                        },
                        {
                            "separator": "true"
                        },
                        {
                            "label": "Add row",
                            "key": "subMenusSubMenu4",
                            "disabledStatus": true
                        }
                    ]
                }],
            events: {
                show: function (opt) {
                    console.log("Menu opened");
                },
                hide: function (opt) {
                    console.log("Menu closed");
                }
            }
        }
        // { //to be supported
        //     "dropdown_type": true,
        //     "label": "Group by",
        //     "key": "dropdownKey",
        //     "disabledStatus": true, //default status is false
        //     "items": [
        //         {
        //             "label": "None",
        //             "key": "noneDropdown",
        //             "selected": true
        //         },
        //         {
        //             "label": "One",
        //             "key": "oneDropdown"
        //         },
        //         {
        //             "label": "Many",
        //             "key": "manyDropdown"
        //         }
        //     ]
        // },
        // { //to be supported
        //     "custom_type": true, //should be able to return label, selected value, items, width -might be from width()-
        //     "formatter": getCustomActionHtml, //callback that should return Object with html to be used in the action container, default property is a required field
        //     "key": "customCheckboxAction"
        // }
    ];

    return actionBarConfiguration;
});