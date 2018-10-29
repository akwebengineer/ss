/**
 * A configuration object with the parameters required to build 
 * a grid for services
 *
 * @module serviceReplaceFormGridConfiguration
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
], function () {

    var Configuration = function(context) {

        this.getValues = function() {

            return {
                "tableId": "service-replace-table",
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
                        "index": "is-group",
                        "name": "is-group",
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
