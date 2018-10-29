/**
 * A configuration object with the parameters required to build 
 * a grid for Device Profile
 *
 * @module deviceGridConfiguration
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
                "title": context.getMessage('utm_device_grid_title'),
                "title-help": {
                    "content": context.getMessage('utm_device_profile_grid_tooltip'),
                    "ua-help-text": context.getMessage('more_link'),
                    "ua-help-identifier":  context.getHelpKey("UTM_DEVICE_PROFILE_CREATING")
                },
                "tableId": "device-profiles",
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
                "url": "/api/juniper/sd/utm-management/utm-device-profiles",
                "jsonRoot": "utm-device-profiles.utm-device-profile",
                "jsonRecords": function(data) {
                    return data['utm-device-profiles'][RestApiConstants.TOTAL_PROPERTY];
                },
                "ajaxOptions": {
                    "headers": {
                        "Accept": 'application/vnd.juniper.sd.utm-management.utm-device-profile-refs+json;version=1;q=0.01'
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
                        "index": "as-address-white-list.name",
                        "name": "as-address-white-list.name",
                        "sortable": false,
                        "width": 250,
                        "label": context.getMessage('utm_device_grid_column_as_address_white_list')
                    },
                    {
                        "index": "as-address-black-list.name",
                        "name": "as-address-black-list.name",
                        "sortable": false,
                        "width": 250,
                        "label": context.getMessage('utm_device_grid_column_as_address_black_list')
                    },
                    {
                        "index": "av-url-category-white-list.name",
                        "name": "av-url-category-white-list.name",
                        "sortable": false,
                        "width": 250,
                        "label": context.getMessage('utm_device_grid_column_av_url_category_white_list')
                    }, 
                    {
                        "index": "wf-url-category-white-list.name",
                        "name": "wf-url-category-white-list.name",
                        "sortable": false,
                        "width": 250,
                        "label": context.getMessage('utm_device_grid_column_wf_url_category_white_list')
                    }, 
                    {
                        "index": "wf-url-category-black-list.name",
                        "name": "wf-url-category-black-list.name",
                        "sortable": false,
                        "width": 250,
                        "label": context.getMessage('utm_device_grid_column_wf_url_category_black_list')
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
