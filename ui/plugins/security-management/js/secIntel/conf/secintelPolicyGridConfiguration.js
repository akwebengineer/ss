/**
 * A configuration object with the parameters required to build 
 * a grid for Security Intelligence Policies
 *
 * @module secintelPolicyGridConfiguration
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
  'text!../../../../sd-common/js/templates/secintelProfiles.html',
    '../../../../ui-common/js/common/restApiConstants.js',
    '../../../../ui-common/js/common/gridConfigurationConstants.js'
], function(profilesTemplate, RestApiConstants, GridConfigurationConstants) {

    var Configuration = function(context) {

        var convertValue = function(value) {
            var valueMap = {
                    "CommandAndControl": context.getMessage('secintel_profile_category_commandandcontrol'),
                    "WebAppSecure": context.getMessage('secintel_profile_category_webappsecure')
            };

            if (Array.isArray(value["secintel-profile"])) {
                for (var i=0; i<value["secintel-profile"].length; i++) {
                    if (valueMap[value["secintel-profile"][i].category]) {
                        value["secintel-profile"][i].category = valueMap[value["secintel-profile"][i].category];
                    }
                }
            } else {
                if (valueMap[value["secintel-profile"].category]) {
                    value["secintel-profile"].category = valueMap[value["secintel-profile"].category];
                }
            }

            return value;
        };

        var profilesFormatter = function(value) {
            // Render template
            return Slipstream.SDK.Renderer.render(profilesTemplate, convertValue(value));
        };

        this.getValues = function() {

            return {
                "title": context.getMessage('secintel_policy_grid_title'),
                "title-help": {
                    "content": context.getMessage('secintel_policy_grid_tooltip'),
                    "ua-help-identifier": "alias_for_ua_event_binding"
                },
                "tableId": "secintel-policies",
                "numberOfRows": GridConfigurationConstants.PAGE_SIZE,
                "height": "500px",
                "sortName": "name",
                "sortOrder": "asc",
                "repeatItems": "true",
                "multiselect": "true",
                "scroll": true,
                "url": "/api/juniper/sd/secintel-management/secintel-policies",
                "jsonRoot": "secintel-policies.secintel-policy",
                "jsonRecords": function(data) {
                    return data['secintel-policies'][RestApiConstants.TOTAL_PROPERTY];
                },
                "ajaxOptions": {
                    "headers": {
                        "Accept": 'application/vnd.juniper.sd.secintel-management.secintel-policies+json;version=1;q=0.01'
                    }
                },
                "contextMenu": {
                    "edit": context.getMessage('secintel_policy_grid_edit'),
                    "delete": context.getMessage('secintel_policy_grid_delete')
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
                        "label": context.getMessage('grid_column_name'),
                        "width": 300
                    },
                    {
                        "index": "domain-name",
                        "name": "domain-name",
                        "label": context.getMessage('grid_column_domain'),
                        "width": 300
                    },
                    {
                        "index": "secintel-profiles",
                        "name": "secintel-profiles",
                        "label": context.getMessage('secintel_policy_grid_column_profiles'),
                        "width": 300,
                        "formatter": profilesFormatter
                    },
                    {
                        "index": "description",
                        "name": "description",
                        "label": context.getMessage('grid_column_description'),
                        "width": 300
                    }
                ]
            };
        };
    };

    return Configuration;
});
