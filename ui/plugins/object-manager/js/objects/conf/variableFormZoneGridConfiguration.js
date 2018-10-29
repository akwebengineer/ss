/**
 * A configuration object with the parameters required to build 
 * a grid for zones
 *
 * @module variableFormZoneGridConfiguration
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
        '../../../../ui-common/js/common/gridConfigurationConstants.js'
], function (GridConfigurationConstants) {
    var contextValueFormatter = function(cellValue, options, rowObject) {
        var contextValues = [];
        for (var i=0; i<cellValue.length; i++) {
            contextValues.push(cellValue[i].name);
        }
        return contextValues;
    };

    var Configuration = function(context) {

        this.getValues = function() {

            return {
                "tableId": "variable-zone",
                "numberOfRows": GridConfigurationConstants.OVERLAY_PAGE_SIZE,
                "height": "200px",
                "repeatItems": "true",
                "multiselect": "true",
                "scroll": true,
                "jsonId": "id",
                "contextMenu": {
                    "edit": context.getMessage('variable_form_zone_grid_edit'),
                    "delete": context.getMessage('variable_form_zone_grid_delete')
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
                "columns": [
                    {
                        "index": "id",
                        "name": "id",
                        "hidden": true
                    },
                    {
                        "index": "device-id-string",
                        "name": "device-id-string",
                        "hidden": true
                    },
                    {
                        "index": "context-value",
                        "name": "context-value",
                        "label": context.getMessage('varaible_form_grid_column_context_value'),
                        "width": 270,
                        "collapseContent":{
                            "formatData": contextValueFormatter
                        }
                    },
                    {
                        "index": "variable-zone",
                        "name": "variable-zone",
                        "label": context.getMessage('variable_form_grid_column_zone'),
                        "width": 270
                    }
                ]
            };
        };

        this.getEvents = function() {
            return {
                createEvent: "createZoneAction",
                updateEvent: "modifyZoneAction",
                deleteEvent: "deleteZoneAction"
            };
        };
    };

    return Configuration;
});
