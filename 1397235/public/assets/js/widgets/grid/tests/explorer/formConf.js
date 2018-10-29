/*
Configuration for setting up the form in demo page
*/

define([
], function () {

    var configurationSample = {};

    configurationSample.elements = {
        "title": "Grid Demo",
        "form_id": "gridDemo",
        "form_name": "gridDemo",
        "title-help": {
            "content": "Configure grid options for demo.(Only UI options are configurable not callbacks)",
            "ua-help-identifier": "alias_for_title_ua_event_binding"
        },
        "err_div_id": "errorDiv",
        "err_div_message": "One or more fields have errors. Update the fields highlighted below. For detailed information on possible values see",
        "err_div_link":"http://www.juniper.net/techpubs/en_US/junos12.1x46/topics/task/configuration/j-web-basic-settings.html",
        "err_div_link_text":"Configuring Basic Settings",
        "err_timeout": "1000",
        "valid_timeout": "5000",
        "sections": [
            {
                "heading": "Instantiate grid with options below",
                "heading_text": "Fill in options to see the grid",
                "section_id": "section_id_1",
                
                "elements": [
                    {
                        "element_text": true,
                        "id": "grid_title",
                        "name": "grid_title",
                        "label": "title",
                        "field-help": {
                            "content": "grid title",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "value": "Firewall Policies",   
                        "pattern": ".*"
                    },
                    {
                        "element_text": true,
                        "id": "grid_data",
                        "name": "grid_data",
                        "label": "Data url",
                        "field-help": {
                            "content": "URL of API to get data",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "value": "/api/get-data",   
                        "pattern": ".*",
                        "disabled": true
                    },
                    {
                        "element_text": true,
                        "id": "grid_data_root",
                        "name": "grid_data_root",
                        "label": "Data root",
                        "field-help": {
                            "content": "Root of the json DATA",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "value": "policy-Level1.policy-Level2.policy-Level3",   
                        "pattern": ".*",
                        "disabled": true
                    },
                    {
                        "element_text": true,
                        "id": "grid_data_id",
                        "name": "grid_data_id",
                        "label": "Data ID",
                        "field-help": {
                            "content": "ID of the data",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "value": "name",   
                        "pattern": ".*",
                        "disabled": true
                    },
                    {
                        "element_text": true,
                        "id": "grid_title_help",
                        "name": "grid_title_help",
                        "label": "title help",
                        "field-help": {
                            "content": "grid title help",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "value": "Tooltip for the title of the Grid Widget",   
                        "pattern": ".*"
                    },
                    {
                        "element_text": true,
                        "id": "grid_refresh_tooltip",
                        "name": "grid_refresh_tooltip",
                        "label": "refresh tooltip",
                        "field-help": {
                            "content": "grid refresh button tooltip text",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "value": "click me!",   
                        "pattern": ".*"
                    },
                    {
                        "element_text": true,
                        "id": "grid_height",
                        "name": "grid_height",
                        "label": "height",
                        "field-help": {
                            "content": "Height of the grid, can be auto or height in pixels",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "value": "auto",   
                        "pattern": ".*"
                    },
                    {
                        "element_number": true,
                        "id": "grid_no_of_rows",
                        "name": "grid_no_of_rows",
                        "label": "scroll rows",
                        "required": false,
                        "min_value":"0",
                        "max_value":"1000",
                        "value": "40",
                        "error": "Please enter a number between 0 and 1000" ,
                        "field-help": {
                                "content": "Defines the number of rows that will be requested from the API to show the next set of rows for virtual scrolling (pagination).",
                                "ua-help-identifier": "alias_for_title_ua_event_binding"
                            },  
                    }, 
                    {
                        "element_number": true,
                        "id": "grid_max_rows",
                        "name": "grid_max_rows",
                        "label": "scroll rows",
                        "required": false,
                        "min_value":"0",
                        "max_value":"1000",
                        "value": "126",
                        "error": "Please enter a number between 0 and 1000" ,
                        "field-help": {
                                "content": "Defines a function that returns the number of records that an API response could have.",
                                "ua-help-identifier": "alias_for_title_ua_event_binding"
                            },  
                    },
                    {
                        "element_text": true,
                        "id": "grid_noResultAvailable_string",
                        "name": "grid_noResultAvailable_string",
                        "label": "noResultAvailable Text",
                        "required": false,
                        "value": "No result found",
                        "pattern": ".*" ,
                        "field-help": {
                            "content": "Defines a custom message that will be shown in the grid, if no records are available. This accepts a string value and callback function that should return string value.",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        }  
                    },
                    {
                        "element_checkbox": true,
                        "id": "grid_delete_row",
                        "label": "delete row",
                        "required": false,
                        "values": [
                            {
                                "id": "grid_delete_message_checkbox",
                                "name": "grid_delete_message_checkbox",
                                "label": "message callback",
                                "value": "grid_delete_message_checkbox",
                                "checked": false,
                                "disabled":true
                            },
                            {
                                "id": "grid_delete_onDelete_checkbox",
                                "name": "grid_delete_onDelete_checkbox",
                                "label": "onDelete callback",
                                "value": "grid_delete_onDelete_checkbox",
                                "checked": false,
                                "disabled":true
                            },
                            {
                                "id": "grid_delete_autoRefresh_checkbox",
                                "name": "grid_delete_autoRefresh_checkbox",
                                "label": "autoRefresh",
                                "value": "grid_delete_autoRefresh_checkbox",
                                "checked": true
                            }
                        ],
                        "field-help": {
                            "content": "Defines the options available on row deletion like the message that will be showed when a row is deleted, if the grid should be automatically refreshed when the user confirms row deletion and the callback that should be invoked before the row is deleted from the grid.",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        }   
                    },
                    {
                        "element_checkbox": true,
                        "id": "grid_columns",
                        "label": "columns",
                        "name":"grid_columns",
                        "values": [
                            { 
                                "id": "name",
                                "name": "column_name",
                                "label": "name",
                                "checked": true,
                                "value": "name"
                            },
                            { 
                                "id": "inactive",
                                "label": "inactive",
                                "name": "column_inactive",
                                "value": "inactive",
                                "checked": true
                            },
                            { 
                                "id": "sourceZone",
                                "label": "sourceZone",
                                "name": "column_sourceZone",
                                "value": "sourceZone",
                                "checked": true
                            },
                            { 
                                "id": "sourceAddress",
                                "label": "sourceAddress",
                                "name": "column_sourceAddress",
                                "value": "sourceAddress",
                                "checked": true
                            },
                            { 
                                "id": "destinationZone",
                                "label": "destinationZone",
                                "name": "column_destinationZone",
                                "value": "destinationZone",
                                "checked": true
                            },
                            { 
                                "id": "destinationAddress",
                                "label": "destinationAddress",
                                "name": "column_destinationAddress",
                                "value": "destinationAddress",
                                "checked": true
                            },
                            { 
                                "id": "date",
                                "label": "date",
                                "name": "column_date",
                                "value": "date",
                                "checked": true
                            },
                            {   "id": "application",
                                "label": "application",
                                "name": "column_application",
                                "value": "application",
                                "checked": true
                            },
                            { 
                                "id": "application-services",
                                "label": "application_services",
                                "name": "column_application_services",
                                "value": "application-services",
                                "checked": true
                            },
                            { 
                                "id": "action",
                                "label": "action",
                                "name": "column_action",
                                "value": "action",
                                "checked": true
                            },
                            { 
                                "id": "description",
                                "label": "description",
                                "name": "column_description",
                                "value": "description",
                                "checked": true
                            }

                            
                        ],
                        "field-help": {
                            "content": " contains the data required to render the header of the table and column features like editing, validation, etc. It's a required parameter and should contain an array with objects that represent each of the columns of the grid. ",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        }
                    },
                    {
                        "element_dropdown": true,
                        "id": "grid_sort_col",
                        "name": "grid_sort_col",
                        "label": "sort on",
                        "values": [ 

                            { 
                                "label": "name",
                                "value": "name"
                            },
                            { 
                                "nlabel": "inactive",
                                "value": "inactive"
                            },
                            { 
                                "label": "sourceZone",
                                "value": "sourceZone"
                            },
                            { 
                                "label": "sourceAddress",
                                "value": "sourceAddress"
                            },
                            { 
                                "label": "destinationZone",
                                "value": "destinationZone"
                            },
                            { 
                                "label": "destinationAddress",
                                "value": "destinationAddress"
                            },
                            { 
                                "label": "date",
                                "value": "date"
                            },
                            { 
                                "label": "application",
                                "value": "application"
                            },
                            { 
                                "label": "application_services",
                                "value": "application_services"
                            },
                            { 
                                "label": "action",
                                "value": "action"
                            },
                            { 
                                "label": "description",
                                "value": "description"
                            }
                        ],
                        "field-help": {
                            "content": " Defines the id of the column that will be used to sort the table by default. ",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        }
                    },
                    {
                        "element_radio": true,
                        "id": "grid_order",
                        "label": "sort order",                        
                        "values": [
                            {
                                "id": "grid_order_asc_radio",
                                "name": "grid_order_radio",
                                "label": "Ascending",
                                "value": "grid_order_asc_radio",
                                "checked": true
                                
                            },
                            {
                                "id": "grid_order_desc_desc",
                                "name": "grid_order_radio",
                                "label": "Descending",
                                "value": "grid_order_desc_radio"
                            }
                            
                        ],
                        "field-help": {
                            "content": " Defines the sorting order. ",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        } 
                    },
                    {
                        "element_checkbox": true,
                        "id": "grid_other",
                        "label": "Grid Options",
                        "required": false,
                        "values": [
                            {
                                "id": "grid_actionEvents_checkbox",
                                "name": "grid_actionEvents_checkbox",
                                "label": "actionEvents",
                                "value": "grid_actionEvents_checkbox",
                                "checked": true
                            },
                            // {
                            //    "id": "grid_cellOverlayViews_checkbox",
                            //     "name": "grid_cellOverlayViews_checkbox",
                            //     "label": "cellOverlayViews",
                            //     "value": "grid_cellOverlayViews_checkbox",
                            //     "checked": true
                            // },
                            {   
                               "id": "grid_cellTooltip_checkbox",
                                "name": "grid_cellTooltip_checkbox",
                                "label": "cellTooltip",
                                "value": "grid_cellTooltip_checkbox",
                                "checked": true
                            },
                            {
                               "id": "grid_onConfigUpdate_checkbox",
                                "name": "grid_onConfigUpdate_checkbox",
                                "label": "onConfigUpdate",
                                "value": "grid_onConfigUpdate_checkbox",
                                "checked": true
                            },
                            {
                                "id": "grid_refresh_checkbox",
                                "name": "grid_refresh_checkbox",
                                "label": "refresh callback",
                                "value": "grid_refresh_checkbox",
                                "checked": false,
                                "disabled": true
                            },
                            {
                                "id": "grid_multiselect_checkbox",
                                "name": "grid_multiselect_checkbox",
                                "label": "multiselect",
                                "value": "grid_multiselect_checkbox",
                                "checked": true
                            },
                            {
                                "id": "grid_scroll_checkbox",
                                "name": "grid_scroll_checkbox",
                                "label": "scroll",
                                "value": "grid_scroll_checkbox",
                                "checked": true
                            },
                            {
                                "id": "grid_onSelectAll_checkbox",
                                "name": "grid_onSelectAll_checkbox",
                                "label": "onSelectAll",
                                "value": "grid_onSelectAll_checkbox",
                                "checked": false,
                                "disabled": true
                            },
                            {
                                "id": "grid_dragNDrop_checkbox",
                                "name": "grid_dragNDrop_checkbox",
                                "label": "dragNDrop",
                                "value": "grid_dragNDrop_checkbox",
                                "checked": true
                            },
                            {
                                "id": "grid_showRowNumbers_checkbox",
                                "name": "grid_showRowNumber_checkbox",
                                "label": "showRowNumber",
                                "value": "grid_showRowNumber_checkbox",
                                "checked": true
                            }
                        ],
                        "field-help": {
                            "content": " defines other configuration options that the grid takes",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        }
                        
                    },
                ]
            },
            {
                "heading": "Action Area of grid",
                "heading_text": "Configure Action Area of grid",
                "section_id": "section_id_2",
                "progressive_disclosure": "collapsed",
                "elements":  [
                    {
                        "element_checkbox": true,
                        "id": "grid_actionStatusCallback",
                        "label": "set actionStatusCallback",
                        "required": false,
                        "values": [
                            {
                                "id": "grid_actionStatusCallback_checkbox",
                                "name": "grid_actionStatusCallback_checkbox",
                                "label": "",
                                "value": "grid_actionStatusCallback_checkbox",
                                "checked": false,
                                "disabled": true                             
                            }
                        ],
                        "field-help": {
                            "content": "Defines a callback that will be invoked when a user selects on a row. Depending on the row value, the action icons or action menus could be enabled or disabled.",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        }   
                    },
                    {
                        "element_checkbox": true,
                        "id": "grid_customButton",
                        "label": "add customButton",
                        "required": false,
                        "values": [
                            {
                                "id": "grid_iconType_checkbox",
                                "name": "grid_iconType_checkbox",
                                "label": "Icon Type",
                                "value": "grid_iconType_checkbox",
                                "checked": true
                            },
                            {
                                "id": "grid_buttonType_checkbox",
                                "name": "grid_buttonType_checkbox",
                                "label": "Button Type",
                                "value": "grid_buttonType_checkbox",
                                "checked": true
                            },
                            {
                                "id": "grid_menuType_checkbox",
                                "name": "grid_menuType_checkbox",
                                "label": "Menu Type",
                                "value": "grid_menuType_checkbox",
                                "checked": true
                            }
                        ],
                        "field-help": {
                            "content": "Defines the custom buttons, menus and icons that can be added to action area of the grid widget.",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        }   
                    },
                    {
                        "element_checkbox": true,
                        "id": "grid_contextMenu",
                        "label": "Context Menu",
                        "required": false,
                        "values": [
                            {
                                "id": "grid_edit_checkbox",
                                "name": "grid_edit_checkbox",
                                "label": "Edit",
                                "value": "grid_edit_checkbox",
                                "checked": true
                            },
                            {
                                "id": "grid_enable_checkbox",
                                "name": "grid_enable_checkbox",
                                "label": "Enable",
                                "value": "grid_enable_checkbox",
                                "checked": true
                            },
                            {
                                "id": "grid_disable_checkbox",
                                "name": "grid_disable_checkbox",
                                "label": "Disable",
                                "value": "grid_disable_checkbox",
                                "checked": true
                            },
                            {
                                "id": "grid_createBefore_checkbox",
                                "name": "grid_createBefore_checkbox",
                                "label": "Create Before",
                                "value": "grid_createBefore_checkbox",
                                "checked": true
                            },
                            {
                                "id": "grid_createAfter_checkbox",
                                "name": "grid_createAfter_checkbox",
                                "label": "Create After",
                                "value": "grid_createAfter_checkbox",
                                "checked": true
                            },
                            {
                                "id": "grid_copy_checkbox",
                                "name": "grid_copy_checkbox",
                                "label": "Copy",
                                "value": "grid_copy_checkbox",
                                "checked": true
                            },
                            {
                                "id": "grid_pasteBefore_checkbox",
                                "name": "grid_pasteBefore_checkbox",
                                "label": "Paste Before",
                                "value": "grid_pasteBefore_checkbox",
                                "checked": true
                            },
                            {
                                "id": "grid_pasteAfter_checkbox",
                                "name": "grid_pasteAfter_checkbox",
                                "label": "Paste After",
                                "value": "grid_pasteAfter_checkbox",
                                "checked": true
                            },
                            {
                                "id": "grid_delete_checkbox",
                                "name": "grid_delete_checkbox",
                                "label": "Delete",
                                "value": "grid_delete_checkbox",
                                "checked": true
                            },
                            {
                                "id": "grid_quickView_checkbox",
                                "name": "grid_quickView_checkbox",
                                "label": "Quick View",
                                "value": "grid_quickView_checkbox",
                                "checked": true
                            },
                            {
                                "id": "grid_clearAll_checkbox",
                                "name": "grid_clearAll_checkbox",
                                "label": "Clear All",
                                "value": "grid_clearAll_checkbox",
                                "checked": true
                            },
                            {
                                "id": "grid_custom_checkbox",
                                "name": "grid_custom_checkbox",
                                "label": "Custom",
                                "value": "grid_custom_checkbox",
                                "checked": true
                            }
                        ],
                        "field-help": {
                            "content": "Defines a context menu available when user does a right click on a column. ",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        }   
                    },
                    {
                        "element_checkbox": true,
                        "id": "grid_contextMenuStatusCallback",
                        "label": "contextMenuStatusCallback",
                        "required": false,
                        "values": [
                            {
                                "id": "grid_contextMenuStatusCallback_checkbox",
                                "name": "grid_contextMenuStatusCallback_checkbox",
                                "label": "",
                                "value": "grid_contextMenuStatusCallback_checkbox",
                                "checked": false,
                                "disabled": true
                            }
                        ],
                        "field-help": {
                            "content": "Defines a callback function that allows to define an asynchronous call to an API that could provide the status of each item in a context menu.",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        }   
                    },
                    {
                        "element_checkbox": true,
                        "id": "grid_contextMenuItemStatus",
                        "label": "contextMenuItemStatus callback",
                        "required": false,
                        "values": [
                            {
                                "id": "grid_contextMenuItemStatus_checkbox",
                                "name": "grid_contextMenuItemStatus_checkbox",
                                "label": "",
                                "value": "grid_contextMenuItemStatus_checkbox",
                                "checked": false,
                                "disabled": true
                            }
                        ],
                        "field-help": {
                            "content": "defines a callback function that allows to enable or disable an item menu from the more menu of the action area or the context menu of a row.",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        }   
                    },
                    {
                        "element_checkbox": true,
                        "id": "grid_search",
                        "label": "search options",
                        "required": false,
                        "values": [
                            {
                                "id": "grid_searchUrl_checkbox",
                                "name": "grid_searchUrl_checkbox",
                                "label": "Search URL",
                                "value": "grid_searchUrl_checkbox",
                                "checked": true
                            },
                            {
                                "id": "grid_onBeforeSearch_checkbox",
                                "name": "grid_onBeforeSearch_checkbox",
                                "label": "onBeforeSearch callback",
                                "value": "grid_onBeforeSearch_checkbox",
                                "checked": false,
                                "disabled": true
                            },
                            {
                                "id": "grid_searchResult_checkbox",
                                "name": "grid_searchResult_checkbox",
                                "label": "searchResult callback",
                                "value": "grid_searchResult_checkbox",
                                "checked": false,
                                "disabled": true
                            },
                            {
                                "id": "grid_advancedSearch_checkbox",
                                "name": "grid_advancedSearch_checkbox",
                                "label": "advanced search",
                                "value": "grid_advancedSearch_checkbox",
                                "checked": true
                            }
                        ],
                        "field-help": {
                            "content": "Defines Search option in a grid.<br/><b>searchUrl </b>The search field allows searching data in the searchable columns of the grid by sending a request to the server with the value of the search value. <br/><b>onBeforeSearch </b>It allows to reformat the tokens available in the grid search so that some of the tokens can be replaced with a string that would fit better the API search request.</br><b>searchResult</b> In case the data is loaded directly in the grid (by using the addRow method); therefore, url or getData parameter is not available, then the searchResult function callback needs to defined.</br><b>noSearchResultMessage </b>Defines a custom message that will be shown in the grid, if no records are available with search.</br><b>advancedSearch </b>Defines the token area as an editable input which allows to add tokens from the the filter menu and modified the default AND operator between tokens with one of the operators selected from the logic menu. ",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        }   
                    },
                    {
                        "element_text": true,
                        "id": "grid_noSearchResultMessage",
                        "name": "grid_noSearchResultMessage",
                        "label": "noSearchResultMessage text",
                        "field-help": {
                            "content": "Defines a custom message that will be shown in the grid, if no records are available with search.",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "value": "No result of the search",   
                        "pattern": ".*"
                    },
                    {
                        "element_checkbox": true,
                        "id": "grid_columnFilter",
                        "label": "columnFilter",
                        "required": false,
                        "values": [
                            {
                                "id": "grid_columnFilter_checkbox",
                                "name": "grid_columnFilter_checkbox",
                                "label": "",
                                "value": "grid_columnFilter_checkbox",
                                "checked": true
                            }
                        ],
                        "field-help": {
                            "content": "It adds a toolbar below the title of the grid. It allows to search data for each of the columns.",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        }   
                    },
                    {
                        "element_checkbox": true,
                        "id": "grid_showFilter",
                        "label": "showFilter",
                        "required": false,
                        "values": [
                            {
                                "id": "grid_Filter_checkbox",
                                "name": "grid_Filter_checkbox",
                                "label": "",
                                "value": "grid_noFilter_checkbox",
                                "checked": true
                            }
                        ],
                        "field-help": {
                            "content": "It adds a toolbar below the title of the grid. It allows to search data for each of the columns.",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        }   
                    },
                    {
                        "element_checkbox": true,
                        "id": "grid_columnItem",
                        "label": "showHideColumnItems",
                        "required": false,
                        "values": [
                            {
                                "id": "grid_ColumnItem_checkbox",
                                "name": "grid_ColumnItem_checkbox",
                                "label": "Show column item",
                                "value": "grid_ColumnItem_checkbox",
                                "checked": true
                            },
                            {
                                "id": "grid_setColumnSelector_checkbox",
                                "name": "grid_columnItem_checkbox",
                                "label": "set column selector",
                                "value": "grid_setColumnSelector_checkbox",
                                "checked": false,
                                "disabled": true
                            },
                            {
                                "id": "grid_updateColumnSelector_checkbox",
                                "name": "grid_columnItem_checkbox",
                                "label": "update column selector",
                                "value": "grid_updateColumnSelector_checkbox",
                                "checked": false,
                                "disabled": true
                            }
                        ],
                        "field-help": {
                            "content": "Allows to show or hide columns in the grid. When the 'Show Hide Columns' menu item is selected, a sub menu with all the available columns is showed. By default all columns are enabled. If the setColumnSelection parameter has a function callback, then the initial selection is set according to the values defined in the callback. If the updateColumnSelection defines a function callback, then the selection in the menu could be saved by the usage of this callback.",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        }   
                    },
                    {
                        "element_checkbox": true,
                        "id": "grid_customOptionMenu",
                        "label": "custom Option Menu",
                        "required": false,
                        "values": [
                            {
                                "id": "grid_customOptionMenu_checkbox",
                                "name": "grid_customOptionMenu_checkbox",
                                "label": "",
                                "value": "grid_customOptionMenu_checkbox",
                                "checked": true
                            }
                        ],
                        "field-help": {
                            "content": " Defines the menu item that will be showed after the 'Show Hide Columns' menu item in option menu. ",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        }   
                    },
                    {
                        "element_checkbox": true,
                        "id": "grid_optionMenuStatusCallback",
                        "label": "optionMenuStatusCallback",
                        "required": false,
                        "values": [
                            {
                                "id": "grid_optionMenuStatusCallback_checkbox",
                                "name": "grid_optionMenuStatusCallback_checkbox",
                                "label": "",
                                "value": "grid_optionMenuStatusCallback_checkbox",
                                "checked": false,
                                "disabled": true
                            }
                        ],
                        "field-help": {
                            "content": "Defines the status (active or inactive) for each item of option menu.",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        }   
                    },
                ]
            }
            
        ],

        "buttonsClass":"buttons_row",
        "buttons": [
             // add buttons
             {
                "id": "generate",
                "name": "generate",
                "value": "Generate",
                "isInactive": true
            }
        ]
        
    };

    configurationSample.values = {
        //any default values used in elements

    };

    return configurationSample;

});