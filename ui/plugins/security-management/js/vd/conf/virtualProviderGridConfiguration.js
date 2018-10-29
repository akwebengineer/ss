/**
 * A configuration object with the parameters required to build 
 * a grid for Virtual Providers
 *
 * @module virtualProviderGridConfiguration
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    '../../../../ui-common/js/common/restApiConstants.js'
], function (RestApiConstants) {

    var Configuration = function(context) {

	this.formatTypeObject = function (cellValue, options, rowObject) {
	    return context.getMessage('virtual_provider_grid_type');
        };

	this.formatConnectionStatusObject = function (cellValue, options, rowObject) {
	    if (cellValue === true) return context.getMessage('virtual_provider_grid_disabled_true');
	    if (cellValue === false) return context.getMessage('virtual_provider_grid_disabled_false');
        };

        this.getValues = function() {

            return {
                "title": context.getMessage('virtual_provider_grid_title'),
                "title-help": {
                    "content": context.getMessage('virtual_provider_grid_tooltip'),
                    "ua-help-identifier": "alias_for_ua_event_binding"
                },
                "tableId": "virtualproviders",
                "numberOfRows": 20,
                "height": "500px",
                "repeatItems": "true",
                "multiselect": "true",
                "scroll": true,
                "url": "/api/juniper/vdirector/vconnector/virtualproviders",
                "jsonRoot": "virtualproviders.virtualprovider",
                "jsonRecords": function(data) {
                    return data.virtualproviders[RestApiConstants.TOTAL_PROPERTY];
                },
                "ajaxOptions": {
                    "headers": {
                        "Accept": 'application/net.juniper.vdirector.vconnector.virtualproviders+json;version=1'
                    }
                },
                "contextMenu": {
                    "createAfter": context.getMessage('virtual_provider_grid_create'),
                    "edit": context.getMessage('virtual_provider_grid_edit'),
                    "delete": context.getMessage('virtual_provider_grid_delete')
                },
                "columns": [
                    {
                        "index": "vprovider-name",
                        "name": "vprovider-name",
                        "label": context.getMessage('grid_column_name'),
                        "width": 160
                    },
                    {
                        "index": "server-name",
                        "name": "server-name",
                        "label": context.getMessage('virtual_provider_grid_column_network_address'),
                        "width": 186
                    },
                    {
                        "index": "vprovider-type",
                        "name": "vprovider-type",
                        "label": context.getMessage('virtual_provider_grid_column_type'),
                        "width": 160,
			"formatter": this.formatTypeObject
                    },
                    {
                        "index": "vprovider-version",
                        "name": "vprovider-version",
                        "label": context.getMessage('virtual_provider_grid_column_version'),
                        "width": 120
                    },
                    {
                        "index": "create-date",
                        "name": "create-date",
                        "label": context.getMessage('virtual_provider_grid_column_create_date'),
                        "width": 180
                    },
                    {
                        "index": "modify-date",
                        "name": "modify-date",
                        "label": context.getMessage('virtual_provider_grid_column_modify_date'),
                        "width": 180
                    },
                    {
                        "index": "disabled",
                        "name": "disabled",
                        "label": context.getMessage('virtual_provider_grid_column_disabled'),
                        "width": 130,
			"formatter": this.formatConnectionStatusObject
                    }
                ],
		"sorting": [
		    {
			"column": "vprovider-name",
			"order": "asc"
		    }
		]
            }
        }
    };

    return Configuration;
});
