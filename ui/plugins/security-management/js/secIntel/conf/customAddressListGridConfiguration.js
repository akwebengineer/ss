/**
 * A configuration object with the parameters required to build
 * a grid for custom address list
 *
 * @module customAddressListGridConfiguration
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
'../../../../ui-common/js/common/gridConfigurationConstants.js'
], function (GridConfigurationConstants) {
    var Configuration = function(context) {

        this.getValues = function() {

            return {
                "tableId": "custom-address-list-table",
                "numberOfRows": GridConfigurationConstants.PAGE_SIZE,
                "height": "100px",
                "repeatItems": "true",
                "scroll": true,
                "jsonId": "id",
                "getData": function () {},
                "columns": [
                    {
                        "index": "id",
                        "name": "id",
                        "hidden": true
                    },
                    {
                        "index": "name",
                        "name": "name",
                        "label": context.getMessage('secintel_profile_address_list'),
                        "width": 90
                    },
                    {
                        "index": "domain-name",
                        "name": "domain-name",
                        "label": context.getMessage('grid_column_domain'),
                        "width": 90
                    }
                ]
            };
        };
    };

    return Configuration;
});
