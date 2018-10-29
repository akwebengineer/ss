/**
 * A configuration object with the parameters required to build 
 * a grid for virtual device templates
 *
 * @module virtualDeviceTemplatesGridConfiguration
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    '../../../../ui-common/js/common/restApiConstants.js'
], function (RestApiConstants) {

    var Configuration = function(context) {

        this.formatNetworkMappingObject = function (cellValue, options, rowObject) {
	    var networks = "";
	    if (rowObject.vmSpecs && rowObject.vmSpecs.networks) {
		var nets = rowObject.vmSpecs.networks.map || false;
		if (nets) {
		    for (i = 0; i < nets.length; i++) {
			networks += nets[i].adapter + ':' + nets[i].network + '; ';	
		    }
		    var index = networks.lastIndexOf(';');
		    networks = networks.substring(0, index);
		}
	    }
	    return networks;
        };

        this.getValues = function() {

            return {
                "title": context.getMessage('virtual_device_templates_grid_title'),
                "title-help": {
                    "content": context.getMessage('virtual_device_templates_grid_tooltip'),
                    "ua-help-identifier": "alias_for_ua_event_binding"
                },
                "tableId": "vdevicetemplates",
                "numberOfRows": 20,
                "height": "500px",
                "repeatItems": "true",
                "multiselect": "true",
                "scroll": true,
                "url": "/api/juniper/vdirector/provtemplate",
                "jsonRoot": "provisionTemplates.template",
                "jsonRecords": function(data) {
                    return data.provisionTemplates[RestApiConstants.TOTAL_PROPERTY];
                },
                "ajaxOptions": {
                    "headers": {
                        "Accept": 'application/net.juniper.vdirector.template.provisionTemplates+json;q=0.01;version=1'
                    }
                },
                "contextMenu": {
                    "createAfter": context.getMessage('virtual_device_temaplates_grid_create'),
		    "edit": context.getMessage('virtual_device_templates_grid_edit'),
                    "delete": context.getMessage('virtual_device_templates_grid_delete')
                },
                "columns": [
                    {
                        "index": "id",
                        "name": "id",
                        "label": context.getMessage('grid_column_id'),
			"hidden": true
                    },
                    {
                        "index": "name",
                        "name": "name",
                        "label": context.getMessage('grid_column_name'),
                        "width": 300
                    },
                    {
                        "index": "product",
                        "name": "product",
                        "label": context.getMessage('grid_column_product'),
                        "width": 110
                    },
                    {
                        "index": "swVersion",
                        "name": "swVersion",
                        "label": context.getMessage('grid_column_version'),
                        "width": 110
                    },
                    {
                        "index": "vmTemplate",
                        "name": "vmTemplate",
                        "label": context.getMessage('virtual_device_templates_grid_column_vmimage'),
                        "width": 150
                    },
                    {
                        "index": "networkMapping",
                        "name": "networkMapping",
                        "label": context.getMessage('virtual_device_templates_grid_column_networkmapping'),
                        "width": 160,
			"formatter": this.formatNetworkMappingObject
                    },
                    {
			"index": "provisionLocator.conHost",
			"name": "provisionLocator.conHost",
                        "label": context.getMessage('virtual_device_templates_grid_column_vhost'),
                        "width": 160
                    },
                    {
                        "index": "provisionLocator.dataCenter",
                        "name": "provisionLocator.dataCenter",
                        "label": context.getMessage('virtual_device_templates_grid_column_datacenter'),
                        "width": 160
                    }
                ],
		"sorting": [
		    {
			"column": "name",
			"order": "asc"
		    }
		]
            }
        }
    };

    return Configuration;
});
