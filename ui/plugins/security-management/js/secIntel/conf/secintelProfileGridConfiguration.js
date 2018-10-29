/**
 * A configuration object with the parameters required to build
 * a grid for profile
 *
 * @module secintelProfileGridConfiguration
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
  'text!../../../../sd-common/js/templates/secintelProfileThreshold.html',
    '../../../../ui-common/js/common/restApiConstants.js',
    '../../../../ui-common/js/common/gridConfigurationConstants.js'
], function(thresholdTemplate, RestApiConstants, GridConfigurationConstants) {

    var Configuration = function(context) {

        var blockThresholdTypeFormatter = function(type) {
            var retValue = {"name": context.getMessage('secintel_profile_block_threshold_type')};
            if (type === 'RECOMMENDED')  retValue["value"] = context.getMessage('secintel_profile_block_threshold_type_recommended');
            if (type === 'CUSTOM')  retValue["value"] = context.getMessage('secintel_profile_block_threshold_type_custom');
            if (type === 'NONE')  retValue["value"] = context.getMessage('secintel_profile_block_threshold_type_none');
            return retValue;
        }

        var blockThresholdLevelFormatter = function(level) {
            var retValue = {"name": context.getMessage('secintel_profile_block_threshold_level')};
            if(level) retValue["value"] = level;
            return retValue;
        }

        var blockOptionFormatter = function(type) {
            var retValue = {"name": context.getMessage('secintel_profile_block_option')};
            if (type === 'DROP_CONNECTION_SILENTLY')  retValue["value"] = context.getMessage('secintel_profile_block_option_drop_connection_silently');
            if (type === 'CLOSE_SERVER_CLIENT_CONN')  retValue["value"] = context.getMessage('secintel_profile_block_option_close_server_client_conn');
            return retValue;
        }

        var redirectMessageTypeFormatter = function(type, message) {
            var retValue = {"name": context.getMessage('secintel_profile_redirect_message_type_name')};
            if (type === 'CUSTOM')  retValue["value"] = context.getMessage('secintel_profile_redirect_message_type_custom');
            if (type === 'DEFAULT')  retValue["value"] = context.getMessage('secintel_profile_redirect_message_type_default');
            if (type === 'URL') {
                retValue["value"] = message;
                retValue["name"] = context.getMessage('secintel_profile_redirect_message_type_name_url');
            }
            return retValue;
        }

        var logOptionFormatter = function(type) {
            var retValue = {"name": context.getMessage('secintel_profile_log_option')};
            if (type === 'NO_LOG')  retValue["value"] = context.getMessage('secintel_profile_log_option_no_log');
            if (type === 'LOG_ALL')  retValue["value"] = context.getMessage('secintel_profile_log_option_log_all');
            if (type === 'LOG_BLOCKED')  retValue["value"] = context.getMessage('secintel_profile_log_option_log_blocked');
            return retValue;
        }

        var convertThresholdData = function(rowObject) {
            var retValue = {};
            retValue["block-threshold-type"] = blockThresholdTypeFormatter(rowObject["block-threshold-type"]);
            retValue["block-threshold-level"] = blockThresholdLevelFormatter(rowObject["block-threshold-level"]);
            retValue["block-option"] = blockOptionFormatter(rowObject["block-option"]);
            retValue["redirect-message-type"] = redirectMessageTypeFormatter(rowObject["redirect-message-type"], rowObject["redirect-message"]);
            retValue["log-option"] = logOptionFormatter(rowObject["log-option"]);
            return retValue;
        }

        var thresholdFormatter = function(cellValue, options, rowObject) {
            return Slipstream.SDK.Renderer.render(thresholdTemplate, convertThresholdData(rowObject));
        };

        var categoryFormatter = function(cellValue, options, rowObject){
            if (cellValue === 'WebAppSecure')  return context.getMessage('secintel_profile_category_webappsecure');
            if (cellValue === 'CommandAndControl')  return context.getMessage('secintel_profile_category_commandandcontrol');
            if (typeof cellValue === 'undefined')  return '';
        }

        this.getValues = function() {

            return {
                "title": context.getMessage('secintel_profile_grid_title'),
                "title-help": {
                    "content": context.getMessage('secintel_profile_grid_tooltip'),
                    "ua-help-identifier": "alias_for_ua_event_binding"
                },
                "tableId": "secintel-profiles",
                "numberOfRows": GridConfigurationConstants.PAGE_SIZE,
                "height": "500px",
                "sortName": "name",
                "sortOrder": "asc",
                "repeatItems": "true",
                "multiselect": "true",
                "scroll": true,
                "url": "/api/juniper/sd/secintel-management/secintel-profiles",
                "jsonRoot": "secintel-profiles.secintel-profile",
                "jsonRecords": function(data) {
                    return data['secintel-profiles'][RestApiConstants.TOTAL_PROPERTY];
                },
                "ajaxOptions": {
                    "headers": {
                        "Accept": 'application/vnd.juniper.sd.secintel-management.secintel-profiles+json;version=1;q=0.01'
                    }
                },
                "contextMenu": {
                    "edit": context.getMessage('secintel_profile_grid_edit'),
                    "delete": context.getMessage('secintel_profile_grid_delete')
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
                        "index": "category",
                        "name": "category",
                        "label": context.getMessage('secintel_profile_grid_column_category'),
                        "formatter":categoryFormatter
                    },
                    {
                        "index": "block-threshold-type",
                        "name": "block-threshold-type",
                        "label": context.getMessage('secintel_profile_grid_column_threshold'),
                        "formatter": thresholdFormatter,
                        "width": 300
                    },
                    {
                        "index": "address_list",
                        "name": "address_list",
                        "label": context.getMessage('secintel_profile_address_list'),
                        "width": 200
                    },
                    {
                        "index": "description",
                        "name": "description",
                        "label": context.getMessage('grid_column_description'),
                        "width": 200
                    }
                ]
            }
        }
    };

    return Configuration;
});
