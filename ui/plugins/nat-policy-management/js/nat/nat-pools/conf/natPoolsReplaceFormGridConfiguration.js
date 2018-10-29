/**
 * A configuration object with the parameters required to build 
 * a grid for nat pools
 *
 * @module natPoolsReplaceFormGridConfiguration
 * @author Sandhya B <sandhyab@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
], function () {

    var Configuration = function(context) {

        this.getValues = function() {

            return {
                "tableId": "natpools-replace-table",
                "height": "200px",
                "scroll": true,
                "getData": function () {
                    var self = this;
                    $(self).addRowData('', "");
                },
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
                        "width": 220
                    },
                    {
                        "index": "pool-type",
                        "name": "pool-type",
                        "label": context.getMessage('natpool_grid_column_pool_type'),
                        "width": 220
                    },
                    {
                        "index": "description",
                        "name": "description",
                        "label": context.getMessage('grid_column_description'),
                        "width": 300
                    }
                ]
            };
        };
    };

    return Configuration;
});
