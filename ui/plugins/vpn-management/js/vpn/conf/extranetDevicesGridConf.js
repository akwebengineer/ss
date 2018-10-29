/**
 * Extranet Devices Grid configuration.
 *
 * @module ExtranetDevicesGridConf
 * @author Jangul Aslam <jaslam@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    '../../../../ui-common/js/common/restApiConstants.js'
], function (RestApiConstants) {

    var ExtranetDevicesGridConf = function(context) {
        this.getValues = function() {

        return {
            "url": "/api/juniper/sd/vpn-management/extranet-devices",
            "title": context.getMessage("extranet_devices_grid_title"),
            "title-help": {
                "content": context.getMessage("extranet_devices_grid_tooltip"),
                "ua-help-text": context.getMessage('more_link'),
                "ua-help-identifier": context.getHelpKey("VPN_EXTRANET_DEVICE_CREATING")
            },
            "tableId": "extranet-devices",
            "jsonRoot": "extranet-devices.extranet-device",
            "height": "500px",
            "numberOfRows": 20,
            "scroll": true,
            "jsonRecords": function(data) {
                    return data['extranet-devices'][RestApiConstants.TOTAL_PROPERTY];
            },
            "ajaxOptions": {
                "headers": {
                    "Accept": 'application/vnd.juniper.sd.vpn-management.extranet-devices+json;version=1;q=0.01'
                }
            },
            "filter": {
               searchUrl : true
            },
            "jsonId": "id",
            "multiselect": "true",
            "contextMenu": {
                "edit": "Edit",
                "delete": "Delete"
            },
            "columns": [
                {
                    "index": "id",
                    "name": "id",
                    "label": context.getMessage("extranet_devices_grid_column_name_id"),
                    "hidden": true,
                    "width": 50
                },
                {
                    "index": "name",
                    "name": "name",
                    "label": context.getMessage("extranet_devices_grid_column_name_name"),
                    "width": 150,
                    "editCell": {
                        "type": "input"
                    }
                },
                {
                    "index": "description",
                    "name": "description",
                    "label": context.getMessage("extranet_devices_grid_column_name_description"),
                    "width": 300,
                    "collapseContent": {
                        "singleValue" : true
                    },
                    "editCell": {
                        "type": "input"
                    }
                },
                {
                    "index": "host-name",
                    "name": "host-name",
                    "label": context.getMessage("extranet_devices_grid_column_name_host-name"),
                    "width": 120,
                    "editCell": {
                        "type": "input"
                    }
                },
                {
                    "index": "ip-address",
                    "name": "ip-address",
                    "label": context.getMessage("extranet_devices_grid_column_name_ip-address"),
                    "width": 120,
                    "editCell": {
                        "type": "input"
                    }
                },
                {
                    "index": "created-by-user-name",
                    "name": "created-by-user-name",
                    "label": context.getMessage("extranet_devices_grid_column_name_created-by"),
                    "width": 120
                },
                {
                    "index": "domain-name",
                    "name": "domain-name",
                    "label": context.getMessage("extranet_devices_grid_column_name_domain-name"),
                    "width": 120,
                    "sortable": false,
                    "editCell": {
                        "type": "input"
                    }
                }
            ]
        }
      }
    };

    return ExtranetDevicesGridConf;
});
