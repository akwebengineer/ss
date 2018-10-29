/**
 * A configuration object with the parameters required to build
 * a grid for update summary list
 *
 * @module signatureDatabaseUpdateSummaryGridConf
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
], function () {
    var Configuration = function(context) {

        this.getValues = function() {

            return {
                "tableId": "signature_database_update_summary_list",
                "height": "260px",
                "repeatItems": "true",
                "scroll": true,
                "getData": function () {},
                "showWidthAsPercentage": false,
                "columns": [
                    {
                        "index": "change-action",
                        "name": "change-action",
                        "label": context.getMessage('signature_database_update_summary_grid_change_action'),
                        "width": 200
                    },
                    {
                        "index": "change-type",
                        "name": "change-type",
                        "label": context.getMessage('signature_database_update_summary_grid_change_type'),
                        "width": 200
                    },
                    {
                        "index": "change-name",
                        "name": "change-name",
                        "label": context.getMessage('signature_database_update_summary_grid_change_name'),
                        "width": 300
                    }
                ]
            };
        };
    };

    return Configuration;
});