/**
 * A configuration object with the parameters required to build 
 * a grid for UTM Content Filters
 *
 * @module contentFilteringGridConfiguration
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    '../../../../ui-common/js/common/restApiConstants.js',
    '../../../../ui-common/js/common/gridConfigurationConstants.js'
], function(RestApiConstants, GridConfigurationConstants) {

    var Configuration = function(context) {

        var permitListFormatter = function(value) {
            if (! value) return '';

            return listFormatter(value['permit-command']);
        }

        var blockListFormatter = function(value) {
            if (! value) return '';

            return listFormatter(value['block-command']);
        }

        var listFormatter = function(value) {
            value =  (Array.isArray(value)) ? 
                value : [ value ];

            return value.join(',');
        };

        var notificationFormatter = function(value) {
            if (! value) return '';

            value['notification-type'] = value['notification-type'] || '';

            return value['notification-type'].toLowerCase();
        }

        this.getValues = function() {

            return {
                "title": context.getMessage('utm_content_filtering_grid_title'),
                "title-help": {
                    "content": context.getMessage('utm_content_filtering_grid_tooltip'),
                    "ua-help-text": context.getMessage('more_link'),
                    "ua-help-identifier":  context.getHelpKey("UTM_CONTENT_FILTERING_PROFILE_CREATING")
                },
                "tableId": "utm-content-filtering",
                "numberOfRows": GridConfigurationConstants.PAGE_SIZE,
                "height": "auto",
                "sorting": [
                    {
                        "column": "name",
                         "order": "asc"
                    }
                ],
                "repeatItems": "true",
                "multiselect": "true",
                "scroll": true,
                "jsonId": "id",
                "url": "/api/juniper/sd/utm-management/content-filtering-profiles",
                "jsonRoot": "content-filtering-profiles.content-filtering-profile",
                "jsonRecords": function(data) {
                    return data['content-filtering-profiles'][RestApiConstants.TOTAL_PROPERTY];
                },
                "ajaxOptions": {
                    "headers": {
                        "Accept": 'application/vnd.juniper.sd.utm-management.content-filtering-profile-refs+json;version=1;q=0.01'
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
                        "index": "permit-command-list",
                        "name": "permit-command-list",
                        "sortable": false,
                        "label": context.getMessage('utm_content_filtering_grid_column_permit_list'),
                        "formatter": permitListFormatter
                    },
                    {
                        "index": "block-command-list",
                        "name": "block-command-list",
                        "sortable": false,
                        "label": context.getMessage('utm_content_filtering_grid_column_block_list'),
                        "formatter": blockListFormatter
                    },
                    {
                        "index": "notification-options",
                        "name": "notification-options",
                        "sortable": false,
                        "label": context.getMessage('utm_content_filtering_grid_column_notice_type'),
                        "formatter": notificationFormatter
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
            }
        }
    };

    return Configuration;
});
