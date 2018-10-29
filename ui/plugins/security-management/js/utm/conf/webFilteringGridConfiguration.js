/**
 * A configuration object with the parameters required to build 
 * a grid for UTM Web Filters
 *
 * @module webFilteringGridConfiguration
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    '../../../../ui-common/js/common/restApiConstants.js',
    '../../../../ui-common/js/common/gridConfigurationConstants.js'
], function(RestApiConstants, GridConfigurationConstants) {

    // Engine Type
    var ENGINE_TYPE_JUNIPER_ENHANCED = "JUNIPER_ENHANCED",
        ENGINE_TYPE_SURF_CONTROL = "SURF_CONTROL",
        ENGINE_TYPE_LOCAL = "LOCAL",
        ENGINE_TYPE_WEBSENSE_REDIRECT = "WEBSENSE";
    // Action
    var ACTION_LOG_AND_PERMIT = "LOG_AND_PERMIT",
        ACTION_BLOCK = "BLOCK",
        ACTION_PERMIT = "PERMIT",
        ACTION_QUARANTINE = "QUARANTINE";

    var Configuration = function(context) {

        this.formatTypeObject = function (cellValue, options, rowObject) {
            if (! cellValue) return '';
            if (cellValue === ENGINE_TYPE_JUNIPER_ENHANCED)
                return context.getMessage('utm_web_filtering_grid_action_juniper_enhanced');
            if (cellValue === ENGINE_TYPE_SURF_CONTROL)
                return context.getMessage('utm_web_filtering_grid_action_surf_control');
            if (cellValue === ENGINE_TYPE_LOCAL)
                return context.getMessage('utm_web_filtering_grid_action_local');
            if (cellValue === ENGINE_TYPE_WEBSENSE_REDIRECT)
                return context.getMessage('utm_web_filtering_grid_action_websense');
        };
        this.formatActionObject = function (cellValue, options, rowObject) {
            if (! cellValue) return '';
            if (cellValue === ACTION_LOG_AND_PERMIT)
                return context.getMessage('utm_web_filtering_grid_type_log_and_permit');
            if (cellValue === ACTION_BLOCK)
                return context.getMessage('utm_web_filtering_grid_type_block');
            if (cellValue === ACTION_PERMIT)
                return context.getMessage('utm_web_filtering_grid_type_permit');
            if (cellValue === ACTION_QUARANTINE)
                return context.getMessage('utm_web_filtering_grid_type_quarantine');
        };

        this.getValues = function() {

            return {
                "title": context.getMessage('utm_web_filtering_grid_title'),
                "title-help": {
                    "content": context.getMessage('utm_web_filtering_grid_tooltip'),
                    "ua-help-text": context.getMessage('more_link'),
                    "ua-help-identifier": context.getHelpKey("UTM_WEB_FILTERING_PROFILE_CREATING")
                },
                "tableId": "utm-web-filtering",
                "numberOfRows": GridConfigurationConstants.PAGE_SIZE,
                "height": "auto",
                "sortName": "name",
                "sortOrder": "asc",
                "repeatItems": "true",
                "multiselect": "true",
                "scroll": true,
                "url": "/api/juniper/sd/utm-management/web-filtering-profiles",
                "jsonId": "id",
                "jsonRoot": "web-filtering-profiles.web-filtering-profile",
                "jsonRecords": function(data) {
                    return data['web-filtering-profiles'][RestApiConstants.TOTAL_PROPERTY];
                },
                "ajaxOptions": {
                    "headers": {
                        "Accept": 'application/vnd.juniper.sd.utm-management.web-filtering-profile-refs+json;version=1;q=0.01'
                    }
                },
                "contextMenu": {
                    "edit": context.getMessage('grid_edit_profile'),
                    "delete": context.getMessage('grid_delete_profile')
                },
                "filter": {
                    searchUrl: true,
                    optionMenu: {
                        "showHideColumnsItem": {},
                        "customItems": []
                    }
                },
                "columns": [
                    {
                        "index": "id",
                        "name": "id",
                        "hidden": true
                    },
                    {
                        "index": "domain-id",
                        "name": "domain-id",
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
                        "sortable": false,
                        "label": context.getMessage('grid_column_domain')
                    },
                    {
                        "index": "profile-type",
                        "name": "profile-type",
                        "sortable": false,
                        "label": context.getMessage('utm_web_filtering_grid_column_profile_type'),
                        "formatter": this.formatTypeObject
                    },
                    {
                        "index": "default-action",
                        "name": "default-action",
                        "sortable": false,
                        "label": context.getMessage('utm_web_filtering_grid_column_default_action'),
                        "formatter": this.formatActionObject
                    },
                    {
                        "index": "timeout",
                        "name": "timeout",
                        "sortable": false,
                        "label": context.getMessage('utm_web_filtering_grid_column_timeout')
                    },
                    {
                        "index": "description",
                        "name": "description",
                        "sortable": false,
                        "collapseContent": {
                            "singleValue" : true
                        },
                        "label": context.getMessage('grid_column_description')
                    }
                ]
            };
        };
    };

    return Configuration;
});
