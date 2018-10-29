/**
 * A configuration object with the parameters required to build 
 * a grid for Anti-Virus Profile
 *
 * @module antivirusGridConfiguration
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    '../../../../ui-common/js/common/restApiConstants.js',
    '../../../../ui-common/js/common/gridConfigurationConstants.js'
], function(RestApiConstants, GridConfigurationConstants) {

    var Configuration = function(context) {

        var profileTypeFormatter = function(cellValue, options, rowObject) {
            if (cellValue === 'KASPERSKY')  return context.getMessage('utm_antivirus_profile_type_kaspersky');
            if (cellValue === 'JUNIPER_EXPRESS')  return context.getMessage('utm_antivirus_profile_type_juniper_express');
            if (cellValue === 'SOPHOS')  return context.getMessage('utm_antivirus_profile_type_sophos');
            if (typeof cellValue === 'undefined')  return '';
        };

        this.getValues = function() {

            return {
                "title": context.getMessage('utm_antivirus_grid_title'),
                "title-help": {
                    "content": context.getMessage('utm_antivirus_grid_tooltip'),
                    "ua-help-text": context.getMessage('more_link'),
                    "ua-help-identifier": context.getHelpKey("UTM_ANTIVIRUS_PROFILE_CREATING")
                },
                "tableId": "anti-virus-profiles",
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
                "url": "/api/juniper/sd/utm-management/anti-virus-profiles",
                "jsonRoot": "anti-virus-profiles.anti-virus-profile",
                "jsonRecords": function(data) {
                    return data['anti-virus-profiles'][RestApiConstants.TOTAL_PROPERTY];
                },
                "ajaxOptions": {
                    "headers": {
                        "Accept": 'application/vnd.juniper.sd.utm-management.anti-virus-profile-refs+json;version=1;q=0.01'
                    }
                },
                "contextMenu": {
                    "edit": context.getMessage('utm_antivirus_grid_edit'),
                    "delete": context.getMessage('utm_antivirus_grid_delete')
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
                        "label": context.getMessage('utm_antivirus_grid_column_profile_type'),
                        "formatter":profileTypeFormatter
                    },
                    {
                        "index": "scan-options.content-size-limit",
                        "name": "scan-options.content-size-limit",
                        "sortable": false,
                        "label": context.getMessage('utm_antivirus_grid_column_content_size_limit')
                    },
                    {
                        "index": "trickling-timeout",
                        "sortable": false,
                        "name": "trickling-timeout",
                        "label": context.getMessage('utm_antivirus_grid_column_trickling_timeout')
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
