/**
 * A configuration object with the parameters required to build 
 * a grid for Security Intelligence Spotlight Secure Connectors
 *
 * @module secintelConnectorGridConfiguration
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    '../../../../ui-common/js/common/restApiConstants.js',
    '../../../../ui-common/js/common/gridConfigurationConstants.js'
], function(RestApiConstants, GridConfigurationConstants) {

    var Configuration = function(context) {

        this.getValues = function() {

            return {
                "title": context.getMessage('secintel_connector_grid_title'),
                "title-help": {
                    "content": context.getMessage('secintel_connector_grid_tooltip'),
                    "ua-help-identifier": "alias_for_ua_event_binding"
                },
                "tableId": "secintel-connectors",
                "numberOfRows": GridConfigurationConstants.PAGE_SIZE,
                "height": "500px",
                "sortName": "name",
                "sortOrder": "asc",
                "repeatItems": "true",
                "multiselect": "true",
                "scroll": true,
                "url": "/api/juniper/sd/connector-management/connectors",
                "jsonRoot": "connectors.connector",
                "jsonRecords": function(data) {
                    return data.connectors[RestApiConstants.TOTAL_PROPERTY];
                },
                "ajaxOptions": {
                    "headers": {
                        "Accept": 'application/vnd.juniper.sd.connector-management.connector-refs+json;version=1;q=0.01'
                    }
                },
                "contextMenu": {
                    "createAfter": context.getMessage('secintel_connector_grid_create'),
                    "edit": context.getMessage('secintel_connector_grid_edit'),
                    "delete": context.getMessage('secintel_connector_grid_delete')
                },
                "columns": [
                    {
                        "index": "name",
                        "name": "name",
                        "label": context.getMessage('grid_column_name'),
                        "width": 120
                    },
                    {
                        "index": "mgmt-ip",
                        "name": "mgmt-ip",
                        "label": context.getMessage('secintel_connector_grid_column_management_ip'),
                        "width": 120
                    },
                    {
                        "index": "feed-status",
                        "name": "feed-status",
                        "label": context.getMessage('secintel_connector_grid_column_feed_status'),
                        "width": 90
                    },
                    {
                        "index": "num-associated-devices",
                        "name": "num-associated-devices",
                        "label": context.getMessage('secintel_connector_grid_column_associated_devices'),
                        "width": 120
                    },
                    {
                        "index": "ha-string",
                        "name": "ha-string",
                        "label": context.getMessage('secintel_connector_grid_column_cluster_status'),
                        "width": 120
                    },
                    {
                        "index": "ip",
                        "name": "ip",
                        "label": context.getMessage('secintel_connector_grid_column_virtual_ip'),
                        "width": 120
                    },
                    {
                        "index": "is-primary-string",
                        "name": "is-primary-string",
                        "label": context.getMessage('secintel_connector_grid_column_primary'),
                        "width": 90
                    },
                    {
                        "index": "ha-members-string",
                        "name": "ha-members-string",
                        "label": context.getMessage('secintel_connector_grid_column_cluster_members'),
                        "width": 120
                    },
                    {
                        "index": "connection-status",
                        "name": "connection-status",
                        "label": context.getMessage('secintel_connector_grid_column_connection_status'),
                        "width": 120
                    },
                    {
                        "index": "software-version",
                        "name": "software-version",
                        "label": context.getMessage('secintel_connector_grid_column_software_version'),
                        "width": 150
                    },
                    {
                        "index": "config-state-string",
                        "name": "config-state-string",
                        "label": context.getMessage('secintel_connector_grid_column_configuration'),
                        "width": 90
                    }
                ]
            };
        };
    };

    return Configuration;
});
