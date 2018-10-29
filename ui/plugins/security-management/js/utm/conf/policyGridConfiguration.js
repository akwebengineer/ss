/**
 * A configuration object with the parameters required to build 
 * a grid for UTM Policies
 *
 * @module utmPolicyGridConfiguration
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'text!../../../../sd-common/js/templates/utmProfiles.html',
    '../../../../ui-common/js/common/restApiConstants.js',
    '../../../../ui-common/js/common/gridConfigurationConstants.js'
], function(profilesTemplate, RestApiConstants, GridConfigurationConstants) {

    var Configuration = function(context) {

        var profilesFormatter = function(value) {
            // Render template add remove trailing comma
            return Slipstream.SDK.Renderer.render(profilesTemplate, value).replace(/,\s+$/, "");
        };

        var webFilteringFormatter = function(value) {
            if ($.isEmptyObject(value)) {
                return "";
            }

            return value.name;
        }

        this.getValues = function() {

            return {
                "title": context.getMessage('utm_policy_grid_title'),
                "title-help": {
                    "content": context.getMessage('utm_policy_grid_tooltip'),
                    "ua-help-text": context.getMessage('more_link'),
                    "ua-help-identifier":  context.getHelpKey("UTM_POLICY_CREATING")
                },
                "tableId": "utm-policies",
                "numberOfRows": GridConfigurationConstants.PAGE_SIZE,
                "height": "auto",
                "sortName": "name",
                "sortOrder": "asc",
                "repeatItems": "true",
                "multiselect": "true",
                "scroll": true,
                "jsonId": "id",
                "url": "/api/juniper/sd/utm-management/utm-policies",
                "jsonRoot": "utm-policies.utm-policy",
                "jsonRecords": function(data) {
                    return data['utm-policies'][RestApiConstants.TOTAL_PROPERTY];
                },
                "ajaxOptions": {
                    "headers": {
                        "Accept": 'application/vnd.juniper.sd.utm-management.utm-policy-refs+json;version=1;q=0.01'
                    }
                },
                "contextMenu": {
                    "edit": context.getMessage('utm_policy_grid_edit'),
                    "delete": context.getMessage('utm_policy_grid_delete')
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
                        "index": "anti-spam-profile",
                        "name": "anti-spam-profile",
                        "sortable": false,
                        "label": context.getMessage('utm_policy_grid_column_anti_spam'),
                        "formatter": webFilteringFormatter
                    },
                    {
                        "index": "anti-virus-profiles",
                        "name": "anti-virus-profiles",
                        "sortable": false,
                        "label": context.getMessage('utm_policy_grid_column_anti_virus'),
                        "formatter": profilesFormatter
                    },
                    {
                        "index": "content-filtering-profiles",
                        "name": "content-filtering-profiles",
                        "sortable": false,
                        "label": context.getMessage('utm_policy_grid_column_content_filtering'),
                        "formatter": profilesFormatter
                    },
                    {
                        "index": "web-filtering-profile",
                        "name": "web-filtering-profile",
                        "sortable": false,
                        "label": context.getMessage('utm_policy_grid_column_web_filtering'),
                        "formatter": webFilteringFormatter
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
