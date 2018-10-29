/**
 * A configuration object with the parameters required to build 
 * a grid for Deployment Status detailed logs
 *
 * @module deployStatusLogGridConfiguration
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    '../../../../ui-common/js/common/restApiConstants.js'
], function (RestApiConstants) {

    var DeployStatusLogGridConfiguration = function(context, linkValue) {

        this.getValues = function() {

	    return {
		"title": context.getMessage("deploy_status_log_grid_title", [linkValue]),
                "title-help": {
                    "content": context.getMessage('deploy_status_log_grid_tooltip'),
                    "ua-help-identifier": "alias_for_ua_event_binding"
                },
                "tableId": "taskloglist",
                "numberOfRows": 20,
                "height": "500px",
                "repeatItems": "true",
                "scroll": true,
		"on_overlay": true,
                "url": "/api/juniper/vdirector/provision/status/log/" + linkValue,
                "jsonRoot": "taskloglist.log",
                "jsonRecords": function(data) {
                    return data.taskloglist[RestApiConstants.TOTAL_PROPERTY];
                },
                "ajaxOptions": {
                    "headers": {
                        "Accept": 'application/net.juniper.vdirector.provision.taskloglist+json;version=1;charset=UTF-8'
                    }
                },
                "columns": [
                    {
                        "index": "id",
                        "name": "id",
                        "hidden": true
                    },
                    {
                        "index": "entity",
                        "name": "entity",
                        "label": context.getMessage('deploy_status_grid_log_column_entity')
                    },
                    {
                        "index": "virtualHost",
                        "name": "virtualHost",
                        "label": context.getMessage('deploy_status_grid_log_column_vhost')
                    },
                    {
                        "index": "dataCenter",
                        "name": "dataCenter",
                        "label": context.getMessage('deploy_status_grid_log_column_datacenter')
                    },
                    {
                        "index": "state",
                        "name": "state",
                        "label": context.getMessage('deploy_status_grid_log_column_state')
                    },
                    {
                        "index": "endTime",
                        "name": "endTime",
                        "label": context.getMessage('deploy_status_grid_log_column_endTime')
                    },
                    {
                        "index": "details",
                        "name": "details",
                        "label": context.getMessage('deploy_status_grid_log_column_details'),
			"width": 350
                    }
		]
            }
        }
    };

    return DeployStatusLogGridConfiguration;
});
