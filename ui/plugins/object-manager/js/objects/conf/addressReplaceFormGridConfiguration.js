/**
 * A configuration object with the parameters required to build 
 * a grid for addresses
 *
 * @module addressReplaceFormGridConfiguration
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
], function () {

    var Configuration = function(context) {

        this.getValues = function() {

            return {
                "tableId": "address-replace-table",
                "height": "200px",
                "scroll": true,
                "columns": [
                    {
                        "index": "id",
                        "name": "id",
                        "hidden": true
                    },
                    {
                        "index": "name",
                        "name": "name",
                        "label": context.getMessage('grid_column_name'),
                        "width": 186
                    },
                    {
                        "index": "address-type",
                        "name": "address-type",
                        "label": context.getMessage('grid_column_type'),
                        "width": 236
                    },
                    {
                        "index": "description",
                        "name": "description",
                        "label": context.getMessage('grid_column_description'),
                        "width": 286
                    }
                ]
            };
        };
    };

    return Configuration;
});
