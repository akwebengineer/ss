/**
 * A configuration object with the parameters required to build 
 * a grid for VM images uploaded
 *
 * @module vmImageGridConfiguration
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    '../../../../ui-common/js/common/restApiConstants.js'
], function (RestApiConstants) {

    var Configuration = function(context) {

        this.getValues = function() {

            return {
                "title": context.getMessage('vm_image_grid_title'),
                "title-help": {
                    "content": context.getMessage('vm_image_grid_tooltip'),
                    "ua-help-identifier": "alias_for_ua_event_binding"
                },
                "tableId": "vmimages",
                "numberOfRows": 20,
                "height": "500px",
                "repeatItems": "true",
                "multiselect": "true",
                "scroll": true,
                "url": "/api/juniper/vdirector/provtemplate/ovfobject",
                "jsonRoot": "ovfObjects.ovf",
                "jsonRecords": function(data) {
                    return data.ovfObjects[RestApiConstants.TOTAL_PROPERTY];
                },
                "ajaxOptions": {
                    "headers": {
                        "Accept": 'application/net.juniper.vdirector.template.ovfObjects+json;q=0.01;version=1'
                    }
                },
                "contextMenu": {
                    "createAfter": context.getMessage('vm_image_grid_create'),
                    "delete": context.getMessage('vm_image_grid_delete')
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
                        "width": 300,
			"sortable": true
                    },
                    {
                        "index": "product",
                        "name": "product",
                        "label": context.getMessage('grid_column_product'),
                        "width": 100,
			"sortable": true
                    },
                    {
                        "index": "vmdkSize",
                        "name": "vmdkSize",
                        "label": context.getMessage('vm_image_grid_column_size'),
                        "width": 100,
			"sortable": true
                    },
                    {
                        "index": "version",
                        "name": "version",
                        "label": context.getMessage('grid_column_version'),
                        "width": 110,
			"sortable": true
                    },
                    {
                        "index": "os",
                        "name": "os",
                        "label": context.getMessage('vm_image_grid_column_os'),
                        "width": 110,
			"sortable": true
                    },
                    {
                        "index": "cpu",
                        "name": "cpu",
                        "label": context.getMessage('vm_image_grid_column_cpu'),
                        "width": 50,
			"sortable": true
                    },
                    {
                        "index": "memory",
                        "name": "memory",
                        "label": context.getMessage('vm_image_grid_column_memory'),
                        "width": 100,
			"sortable": true
                    },
                    {
                        "index": "disk",
                        "name": "disk",
                        "label": context.getMessage('vm_image_grid_column_disk'),
                        "width": 60,
			"sortable": true
                    }
                ]
            }
        }
    };

    return Configuration;
});
