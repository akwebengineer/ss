/**
 * A configuration object with the parameters required to build 
 * a grid for UTM URL Patterns
 *
 * @module urlPatternsGridConfiguration
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
        '../../../../ui-common/js/common/gridConfigurationConstants.js'
], function(GridConfigurationConstants) {
    var urlFormatter = function (cellValue, options, rowObject){
        return '<span data-tooltip=tooltip>'+_.escape(cellValue)+'</span>';
    };
    var urlUnformat = function (cellValue, options, rowObject){
        return cellValue;
    };
    var Configuration = function(context) {
        
        this.getValues = function() {

            return {
                "tableId": "urlpattern-url-list",
                "numberOfRows": GridConfigurationConstants.OVERLAY_PAGE_SIZE,
                "height": "180px",
                "sorting": [ 
                    {
                        "column": "url",
                        "order": "asc"
                    }
                ],
                "repeatItems": "true",
                "multiselect": "true",
                "scroll": true,
                "jsonId": "id",
                "contextMenu": {
                    "edit": context.getMessage('utm_url_patterns_grid_edit'),
                    "delete": context.getMessage('utm_url_patterns_grid_delete')
                },
                "confirmationDialog": {
                    "delete": {
                        title: context.getMessage('warning'),
                        question: context.getMessage('utm_url_patterns_delete_confirmation')
                    }
                },
                "contextMenuItemStatus": function(key, isItemDisabled, selectedRows) {
                    // Single row selection for "edit"
                    if (key == "edit") 
                    {
                        if (selectedRows.length !== 1)
                        {
                            return true;
                        } 
                    }
                },
                "editRow": {
                   "showInline": "true"
                },
                "filter": {
                    searchUrl: true
                },
                "columns": [
                    {
                        "index": "id",
                        "name": "id",
                        "hidden": true
                    },
                    {
                        "index": "url",
                        "name": "url",
                        "label": context.getMessage('utm_url_patterns_url_list'),
                        "width": 350,
                        "formatter":urlFormatter,
                        "unformat":urlUnformat,
                        "editCell":{
                            "type": "input",
                            "post_validation": "customValidation"
                        }
                    }
                ]
            };
        };
        this.getEvents = function() {
            return {
                updateEvent: "modifyAction",
                deleteEvent: "deleteAction"
            };
        };
    };

    return Configuration;
});
