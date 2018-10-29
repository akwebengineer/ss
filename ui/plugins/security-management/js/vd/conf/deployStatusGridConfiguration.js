/**
 * A configuration object with the parameters required to build 
 * a grid for Deployment Status
 *
 * @module deployStatusGridConfiguration
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
  'text!../../../../sd-common/js/templates/vdDeployStatusReference.html',
    '../../../../ui-common/js/common/restApiConstants.js'
], function (summaryTemplate, RestApiConstants) {

    var Configuration = function(context) {

        var createLinkFormatter = function (cellValue, options, rowObject) {
            return Slipstream.SDK.Renderer.render(summaryTemplate, {"cell-id": rowObject.requestID, "text": cellValue});
        };


        this.getValues = function() {

            return {
                "title": context.getMessage('deploy_status_grid_title'),
                "title-help": {
                    "content": context.getMessage('deploy_status_grid_tooltip'),
                    "ua-help-identifier": "alias_for_ua_event_binding"
                },
                "tableId": "alljobstatus",
                "numberOfRows": 20,
                "height": "500px",
                "repeatItems": "true",
                "multiselect": "true",
                "scroll": true,
                "url": "/api/juniper/vdirector/provision/status",
                "jsonRoot": "alljobstatus.request",
                "jsonRecords": function(data) {
                    return data.alljobstatus[RestApiConstants.TOTAL_PROPERTY];
                },
                "ajaxOptions": {
                    "headers": {
                        "Accept": 'application/net.juniper.vdirector.provision.alljobstatus+json;version=1;charset=UTF-8'
                    }
                },
                "contextMenu": {
                    "delete": context.getMessage('deploy_status_grid_delete')
                },
                "columns": [
                    {
                        "index": "id",
                        "name": "id",
                        "label": context.getMessage('grid_column_id'),
                        "hidden": true
                    },
                    {
                        "index": "requestID",
                        "name": "requestID",
                        "label": context.getMessage('deploy_status_grid_column_request_id'),
                        "width": 100
                    },
                    {
                        "index": "requestType",
                        "name": "requestType",
                        "label": context.getMessage('deploy_status_grid_column_request_type'),
                        "width": 120
                    },
                    {
                        "index": "state",
                        "name": "state",
                        "label": context.getMessage('deploy_status_grid_column_status'),
                        "width": 120,
                    },
                    {
                        "index": "percent",
                        "name": "percent",
                        "label": context.getMessage('deploy_status_grid_column_percent'),
                        "width": 80
                    },
                    {
                        "index": "summary",
                        "name": "summary",
                        "label": context.getMessage('deploy_status_grid_column_summary'),
                        "width": 180,
                        "formatter": createLinkFormatter
                    },
                    {
                        "index": "enqueTime",
                        "name": "enqueTime",
                        "label": context.getMessage('deploy_status_grid_column_enque_time'),
                        "width": 160
                    },
                    {
                        "index": "startTime",
                        "name": "startTime",
                        "label": context.getMessage('deploy_status_grid_column_start_time'),
                        "width": 160
                    },
                    {
                        "index": "endTime",
                        "name": "endTime",
                        "label": context.getMessage('deploy_status_grid_column_end_time'),
                        "width": 160
                    }
                ]
            }
        }
    };

    return Configuration;
});
