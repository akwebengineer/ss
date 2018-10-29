/**
 * A configuration object with the parameters required to build 
 * a grid for variable values
 *
 * @module VariableDetailValueGridConfiguration
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
'../../../../ui-common/js/common/gridConfigurationConstants.js'
], function (GridConfigurationConstants) {
    var Configuration = function(context) {

        this.getValues = function() {

            return {
                "tableId": "variable-values",
                "numberOfRows": GridConfigurationConstants.OVERLAY_PAGE_SIZE,
                "height": "200px",
                "repeatItems": "true",
                "scroll": true,
                "jsonId": "id",
                "columns": [
                    {
                        "index": "context-value",
                        "name": "context-value",
                        "label": context.getMessage('varaible_form_grid_column_context_value'),
                        "width": 200
                    },
                    {
                        "index": "variable-value",
                        "name": "variable-value",
                        "label": context.getMessage('variable_detail_value'),
                        "width": 220
                    }
                ]
            };
        };
    };

    return Configuration;
});
