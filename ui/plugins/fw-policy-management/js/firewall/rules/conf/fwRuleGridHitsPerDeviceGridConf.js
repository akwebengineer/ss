/**
 * FW Rule Hits per Device Grid configuration
 *
 * @module FWRuleHitsPerDeviceGridConf
 * @author Omega developer
 * @copyright Juniper Networks, Inc. 2015
 */

define([], function() {

    var FWRuleHitsPerDeviceGridConf = function(context) {

        this.getValues = function() {

            return {
                "tableId": "hits-per-device-grid",
                "numberOfRows": 50,
                "height": "400px",
                "repeatItems": "true",
                "scroll": true,
                "jsonId": "id",
                "getData": function () {
                    var self = this;
                    $(self).addRowData('', "");
                },
                "columns": [
                    {
                        "index": "device_name",
                        "name": "name",
                        "label": context.getMessage('device_name'),
                        "width": 400,
                        "sortable": false
                    },
                    {
                        "index": "current_hits",
                        "name": "hit-count",
                        "label": context.getMessage('current_hits'),
                        "width": 150,
                        "sortable": false
                    },
                    {
                        "index": "total_hits",
                        "name": "total-hit-count",
                        "label": context.getMessage('total_hits'),
                        "width": 150,
                        "sortable": false
                    }
                ]
            };
        };
    };

    return FWRuleHitsPerDeviceGridConf;
});
