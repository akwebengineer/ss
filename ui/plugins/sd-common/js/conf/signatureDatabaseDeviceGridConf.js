/**
 * A configuration object with the parameters required to build
 * a grid for device list
 *
 * @module signatureDatabaseDeviceGridConf
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
'../../../ui-common/js/common/restApiConstants.js',
'../../../ui-common/js/common/gridConfigurationConstants.js'
], function (RestApiConstants, GridConfigurationConstants) {
    var Configuration = function(context) {

        var showConnectionStatus = function(cellvalue, options, rowObject) {
            var css = '';
            if(cellvalue === 'up') {
                css = 'signature-database-connection-status-column-up';
            }else if(cellvalue === 'down'){
                css = 'signature-database-connection-status-column-down';
            }
            return '<span class="' + css + '">' + cellvalue + '</span>';
        };
        var tooltipFormatter = function(cellvalue, options, rowObject) {
            return '<span data-tooltip="'+cellvalue+'">' + cellvalue + '</span>';
        };
        var getRowIds = function (setIdsSuccess, setIdsError) {
            $.ajax({
                type: 'GET',
                url: '/api/juniper/sd/ips-management/idp-device-lists/select-all',
                headers: {
                    "Accept": 'application/vnd.juniper.sd.select-all-devices-ids+json;version=1;q=0.01'
                },
                success: function(data) {
                    var ids = [];
                    if(data && data['devices'] && data['devices']['device']){
                        data['devices']['device'].forEach(function(device) {
                            ids.push(device['sd-device-id']);
                        });
                    }
                    setIdsSuccess(ids);
                },
                error: function() {
                    setIdsError("Getting all row ids in the grid FAILED.");
                }
            });
        };

        this.getValues = function() {

            return {
                "tableId": "signature_database_device_grid",
                "height": "300px",
                "scroll":true,
                "jsonId": "sd-device-id",
                "url": "/api/juniper/sd/ips-management/idp-device-lists",
                "jsonRoot": "idp-devices.idp-device",
                "jsonRecords": function(data) {
                    return data['idp-devices'][RestApiConstants.TOTAL_PROPERTY];
                },
                "title-help": {
                    "content": context.getMessage('signature_database_device_grid_intro'),
                    "ua-help-text": context.getMessage('more_link'),
                    "ua-help-identifier": "signature_database_device_grid_help_identifier"
                },
                "numberOfRows": GridConfigurationConstants.OVERLAY_PAGE_SIZE,
                "multiselect": "true",
                "filter": {
                    searchUrl: true,
                    columnFilter: false,
                    showFilter: false,
                    optionMenu: {
                        "showHideColumnsItem": {},
                        "customItems": []
                    }
                },
                "onSelectAll": getRowIds,
                "ajaxOptions": {
                    "headers": {
                        "Accept": 'application/vnd.juniper.sd.ips-management.idp-device-refs+json;version=1;q=0.01'
                    }
                },
                "actionButtons":{
                   "customButtons":
                        [{
                            "menu_type": true,
                            "label":context.getMessage('signature_database_install_probe_devices'),
                            "key":"probe",
                            "items": [{
                                "label":context.getMessage('signature_database_install_full_probe'),
                                "key":"fullProbeEvent"
                            },{
                                "label":context.getMessage('signature_database_install_delta_probe'),
                                "key":"deltaProbeEvent"
                            }]
                        }]
                },
                "contextMenu": {
                    "custom":[{
                            "label":context.getMessage('signature_database_install_full_probe'),
                            "key":"fullProbeEvent"
                        },{
                            "label":context.getMessage('signature_database_install_delta_probe'),
                            "key":"deltaProbeEvent"
                        }]
                },
                "columns": [
                    {
                        "index": "name",
                        "name": "name",
                        "label": context.getMessage('signature_database_device_grid_device_name'),
                        "width": 100
                    },
                    {
                        "index": "sd-device-id",
                        "name": "sd-device-id",
                        "hidden": true
                    },
                    {
                        "index": "device-ip",
                        "name": "device-ip",
                        "formatter": tooltipFormatter,
                        "label": context.getMessage('signature_database_device_grid_device_ip'),
                        "width": 80
                    },
                    {
                        "index": "platform",
                        "name": "platform",
                        "label": context.getMessage('signature_database_detectors_grid_platform'),
                        "width": 120
                    },
                    {
                        "index": "software-release",
                        "name": "software-release",
                        "formatter": tooltipFormatter,
                        "label": context.getMessage('signature_database_detectors_grid_osversion'),
                        "width": 120
                    },
                    {
                        "index": "ips-license",
                        "name": "ips-license",
                        "label": context.getMessage('signature_database_device_grid_ips_license'),
                        "width": 100
                    },
                    {
                        "index": "app-license",
                        "name": "app-license",
                        "label": context.getMessage('signature_database_device_grid_app_license'),
                        "width": 100
                    },
                    {
                        "index": "detector-version",
                        "name": "detector-version",
                        "formatter": tooltipFormatter,
                        "label": context.getMessage('signature_database_device_grid_detector_version'),
                        "width": 120
                    },
                    {
                        "index": "status",
                        "name": "status",
                        "label": context.getMessage('signature_database_device_grid_connection_status'),
                        "formatter":showConnectionStatus,
                        "width": 120
                    },
                    {
                        "index": "install-schedule",
                        "name": "install-schedule",
                        "sortable": false,
                        "label": context.getMessage('signature_database_device_grid_install_schedule'),
                        "hidden": true,
                        "width": 120
                    }
                ]
            };
        };
    };

    return Configuration;
});
