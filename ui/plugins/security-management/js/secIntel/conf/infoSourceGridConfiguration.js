/**
 * A configuration object with the parameters required to build
 * a grid for information source management
 *
 * @module infoSourceGridConfiguration
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    '../../../../ui-common/js/common/restApiConstants.js',
    '../../../../ui-common/js/common/gridConfigurationConstants.js'
], function(RestApiConstants, GridConfigurationConstants) {

    var Configuration = function(context) {

        var sourceFormatter = function(cellValue, options, rowObject) {
            if (cellValue === 'CLOUD')  return context.getMessage('secintel_info_source_source_cloud');
            if (cellValue === 'CUSTOM_FILE')  return context.getMessage('secintel_info_source_source_custom_file');
            if (cellValue === 'CUSTOM_SERVER')  return context.getMessage('secintel_info_source_source_custom_server');
            if (cellValue === 'JWAS')  return context.getMessage('secintel_info_source_source_jwas');
            if (typeof cellValue === 'undefined')  return '';
        };

        this.getValues = function() {

            return {
                "title": context.getMessage('secintel_info_source_grid_title'),
                "title-help": {
                    "content": context.getMessage('secintel_info_source_grid_tooltip'),
                    "ua-help-identifier": "alias_for_ua_event_binding"
                },
                "tableId": "secintel-info-sources",
                "numberOfRows": GridConfigurationConstants.PAGE_SIZE,
                "height": "500px",
                "sortName": "name",
                "sortOrder": "asc",
                "repeatItems": "true",
                "multiselect": "true",
                "scroll": true,
                "url": "/api/juniper/sd/info-source-management/info-sources",
                "jsonRoot": "info-sources.info-source",
                "jsonRecords": function(data) {
                    return data['info-sources'][RestApiConstants.TOTAL_PROPERTY];
                },
                "ajaxOptions": {
                    "headers": {
                        "Accept": 'application/vnd.juniper.sd.info-source-management.info-source-refs+json;version=1;q=0.01'
                    }
                },
                "contextMenu": {
                    "createAfter": context.getMessage('secintel_info_source_grid_create'),
                    "edit": context.getMessage('secintel_info_source_grid_edit'),
                    "delete": context.getMessage('secintel_info_source_grid_delete')
                },
                "columns": [
                    {
                        "index": "id",
                        "name": "id",
                        "hidden": true
                    },
                    {
                        "index": "name",
                        "name": "name",
                        "label": context.getMessage('grid_column_name')
                    },

                    {
                        "index": "domain-name",
                        "name": "domain-name",
                        "label": context.getMessage('grid_column_domain')
                    },
                    {
                        "index": "source",
                        "name": "source",
                        "label": context.getMessage('secintel_info_source_grid_column_source'),
                        "formatter":sourceFormatter
                    },
                    {
                        "index": "feed-category",
                        "name": "feed-category",
                        "label": context.getMessage('secintel_info_source_grid_column_feed_category'),
                        "width": 200
                    },
                    {
                        "index": "description",
                        "name": "description",
                        "label": context.getMessage('grid_column_description'),
                        "width": 200
                    },
                    {
                        "index": "address",
                        "name": "address",
                        "label": context.getMessage('secintel_info_source_grid_column_address')
                    }
                ]
            }
        }
    };

    return Configuration;
});
