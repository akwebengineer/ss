/**
 * A configuration object with the parameters required to build 
 * a grid for UTM URL Category Lists
 *
 * @module urlCategoryListsGridConfiguration
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    '../../../../ui-common/js/common/restApiConstants.js',
    '../../../../ui-common/js/common/gridConfigurationConstants.js'
], function(RestApiConstants, GridConfigurationConstants) {

    var formatPatternsObject = function (cellValue, options, rowObject) {
        if (! cellValue) return '';

        // REST API response is different with POST data UI composed
        var ul = cellValue['url-pattern'] ? cellValue['url-pattern'] : cellValue['reference'];
        if (!ul) return '';

        var pattern_array = [];
        // multiple patterns are in an array, single pattern is an object
        if ($.isArray(ul)) {
            pattern_array = _.pluck(ul, "name");
        } else {
            pattern_array.push(ul.name);
        }

        return pattern_array;
    };

    var Configuration = function(context) {


        this.getValues = function() {

            return {
                "title": context.getMessage('utm_url_category_grid_title'),
                "title-help": {
                    "content": context.getMessage('utm_url_category_grid_tooltip'),
                    "ua-help-text": context.getMessage('more_link'),
                    "ua-help-identifier": context.getHelpKey("UTM_CUSTOM_URL_CATEGORY_LIST_CREATING")
                },
                "tableId": "utm-url-category",
                "numberOfRows": GridConfigurationConstants.PAGE_SIZE,
                "height": "auto",
                "repeatItems": "true",
                "multiselect": "true",
                "scroll": "true",
                "url": "/api/juniper/sd/utm-management/url-category-lists?filter=(profile-type eq 'CUSTOM')",
                "jsonRoot": "url-category-lists.url-category-list",
                "jsonId": "id",
                "jsonRecords": function(data) {
                    return data['url-category-lists'][RestApiConstants.TOTAL_PROPERTY];
                },
                "sorting": [
                    {
                    "column": "name",
                    "order": "asc"
                    }
                ],
                "ajaxOptions": {
                    "headers": {
                        "Accept": 'application/vnd.juniper.sd.utm-management.url-category-lists+json;version=2'
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
                        "index": "url-patterns",
                        "name": "url-patterns",
                        "sortable": false,
                        "label": context.getMessage('utm_url_category_grid_column_url_patterns'),
                        "collapseContent": {
                            formatData: formatPatternsObject
                        }
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
