/**
 *
 * @module ExemptedAddressesGridViewConfiguration
 * @author ramesha@juniper.net
 * @copyright Juniper Networks, Inc. 2015
 */

define([
], function () {

    var Configuration = function(context) {

        this.getValues = function(option) {
            return {

                "tableId": "sslForwardProxyProfiles1ExemptedAddresses",
                "height": "100px",
                "repeatItems": "false",
                "scroll": true,
                "jsonId": "id",
                "numberOfRows":1200,
                "columns": [
                {
                    "index": "name",
                    "name": "name",
                    "label":context.getMessage("ssl_exemptedAddresses_grid_name"),
                    "width":200
                },
                {
                     "index": "domain-name",
                     "name": "domain-name",
                     "label":context.getMessage("ssl_exemptedAddresses_grid_domain"),
                     "width":250
                }]
            }
        }
    };

    return Configuration;
});
