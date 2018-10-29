/**
 * A configuration object with the parameters required to build
 * a grid for detectors
 *
 * @module signatureDatabaseDetectorsGridConf
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
], function () {
    var Configuration = function(context, versionNo) {

        this.getValues = function() {
            return {
                "tableId": "signature_database_detectors_list",
                "height": "260px",
                "scroll":"true",
                "showWidthAsPercentage": false,
                "url": "/api/juniper/sd/ips-management/ips-detector-list/" + versionNo,
                "jsonRoot": "ips-detector-lists.detector",
                "ajaxOptions": {
                    "headers": {
                        "Accept": 'application/vnd.juniper.sd.ips-management.ips-detector-lists+json;version=1;q=0.01'
                    }
                },
                "columns": [
                    {
                        "id": "platform",
                        "name": "platform",
                        "label": context.getMessage('signature_database_detectors_grid_platform'),
                        "width": 200
                    },{
                        "id": "osversion",
                        "name": "osversion",
                        "label": context.getMessage('signature_database_detectors_grid_osversion'),
                        "width": 200
                    },
                    {
                        "id": "version",
                        "name": "version",
                        "label": context.getMessage('signature_database_detectors_grid_version'),
                        "width": 300
                    }
                ]
            };
        };
    };

    return Configuration;
});