/**
 * A configuration object with the parameters required to build 
 * a grid for UTM URL Patterns
 *
 * @module urlPatternsGridConfiguration
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
                "title": context.getMessage('utm_url_patterns_grid_title'),
                "title-help": {
                    "content": context.getMessage('utm_url_patterns_grid_tooltip'),
                    "ua-help-text": context.getMessage('more_link'),
                    "ua-help-identifier": context.getHelpKey("UTM_URL_PATTERN_CREATING")
                },
                "tableId": "utm-url-patterns",
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
                "url": "/api/juniper/sd/utm-management/url-patterns",
                "jsonId": "id",
                "jsonRoot": "url-patterns.url-pattern",
                "jsonRecords": function(data) {
                    return data['url-patterns'][RestApiConstants.TOTAL_PROPERTY];
                },
                "ajaxOptions": {
                    "headers": {
                        "Accept": 'application/vnd.juniper.sd.utm-management.url-patterns-refs+json;version=1'
                    }
                },
                "contextMenu": {
                    "edit": context.getMessage('utm_url_patterns_grid_edit'),
                    "delete": context.getMessage('utm_url_patterns_grid_delete')
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
                        "index": "address-patterns",
                        "name": "address-patterns.address-pattern",
                        "sortable": false,
                        "label": context.getMessage('utm_url_patterns_grid_column_value'),
                        "collapseContent": "true"
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
