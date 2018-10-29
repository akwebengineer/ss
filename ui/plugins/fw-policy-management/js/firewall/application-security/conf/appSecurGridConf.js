/**
 * A configuration object with the parameters required to build a grid for
 * ApplicationSecurity
 *
 * @module ApplicationSecurityConfiguration
 * @author vinayms@juniper.net
 * @copyright Juniper Networks, Inc. 2015
 */


define([
'text!../templates/AppFwPolicyTemplate.html',
'../../../../../ui-common/js/common/restApiConstants.js',
'text!../templates/actionTemplate.html',
'../../../../../ui-common/js/common/gridConfigurationConstants.js'
], function (policyTemplate, RestApiConstants, actionTemplate, GridConfigurationConstants) {

    var Configuration = function (context) {

        this.getValues = function () {

            return {
                "title": context.getMessage('applicationSecurity_grid_title'),
                "title-help": {
                    "content": context.getMessage('applicationSecurity_grid_tooltip'),
                    "ua-help-text":context.getMessage("more_link"),
                    "ua-help-identifier": context.getHelpKey("APPLICATION_FIREWALL_POLICY_CREATING")
                },
                "tableId": "appsecur",
                "numberOfRows": GridConfigurationConstants.PAGE_SIZE,
                "height": GridConfigurationConstants.TABLE_HEIGHT,
                "sorting": [
                    {
                        "column": "name",
                        "order": "asc"
                    }
                ],
                "onSelectAll": false,
                "repeatItems": "true",
                "multiselect": "true",
                "scroll": true,
                "url": "/api/juniper/sd/policy-management/firewall/app-fw-policy-management/app-fw-policies",
                "jsonRoot": "app-fw-policies.app-fw-policy",
                "jsonId": "id",
                "jsonRecords": function (data) {
                    return data['app-fw-policies'][RestApiConstants.TOTAL_PROPERTY];
                },
                "ajaxOptions": {
                    "headers": {
                        "Accept": 'application/vnd.juniper.sd.app-fw-policy-management.app-fw-policies+json;version=1;q=0.01'
                    }
                },
                "confirmationDialog": {
                    "delete": {
                        title: 'Warning',
                        question: 'Are you sure you wish to delete selected Application Firewall Policies?'
                    }
                },
                "contextMenu": {
                    "edit": context.getMessage('applicationSecurity_grid_edit'),
                    "delete": context.getMessage('applicationSecurity_grid_delete'),
                    "custom":[{
                      "label":context.getMessage('action_find_usage'),
                      "key":"findUsageEvent"
                  }]
                },
               "filter" : {
                   searchUrl : true
                 },
                "columns": [
                    {
                        "id": "id",
                        "name": "id",
                        "hidden": true
                    },
                    {
                        "index": "name",
                        "name": "name",
                        "label": context.getMessage('grid_column_name'),
                        "width": 186,
                        "unformat": function (cellValue, options, rowObject) {
                            return cellValue;
                        },
                        /**
                         * Defining the formatter for the policy grid. This will take to the rule grid. Similar formatter will be defined for rules count
                         */
                        formatter: function (cellValue, options, rowObject) {

                            return Slipstream.SDK.Renderer.render(policyTemplate, {"policyId": rowObject.id, "cellValue": cellValue});


                        }
                    },
                    {
                        "index": "profile-name",
                        "name": "profile-name",
                        "hidden": true,
                        formatter: function (cellValue, options, rowObject) {
                            return rowObject.name;
                        }
                    },
                    {
                        "index": "default-rule",
                        "name": "default-rule",
                        "label": context.getMessage('app_secure_grid_column_default_action'),
                        "width": 100,
                        formatter: function (val) {
                            if (val) {

                                var formattedValue = val.split(';')[0].split('=')[1].toUpperCase(),
                                imgSrc = '/installed_plugins/base-policy-management/images/',
                                img;

                                if (formattedValue === "PERMIT") {
                                    formattedValue = "Permit";
                                    img = 'icon_permit14X14';
                                } else if (formattedValue === "DENY") {
                                    formattedValue = "Deny";
                                    img = 'icon_deny14X14';
                                } else if (formattedValue === "REJECT") {
                                    formattedValue = "Reject";
                                    img = 'icon_reject14X14';
                                } else {
                                    if (!formattedValue)
                                      formattedValue = "";
                                }

                                //setting icons for the actions
                                if (!$.isEmptyObject(formattedValue)) {
                                    var imgIcon = img;

                                    return Slipstream.SDK.Renderer.render(actionTemplate, {"cell-value": formattedValue, "icon": imgIcon, "text": formattedValue});
                                }
                            }
                            return "-";
                        }
                    },
                    {
                        "index": "total-rules",
                        "name": "total-rules",
                        "label": context.getMessage('app_secure_grid_column_rules'),
                        "width": 120,
                        formatter: function (cellValue, options, rowObject) {
                            return Slipstream.SDK.Renderer.render(policyTemplate, {"policyId": rowObject.id,
                                "cellValue": cellValue && cellValue !== 0 ? cellValue : context.getMessage('app_secure_grid_column_add_rule')});
                        }
                    },
                    {
                        "index": "block-message-type",
                        "name": "block-message-type",
                        "label": context.getMessage('app_secure_block_message_type'),
                        "width": 150,
                        formatter: function (val) {
                            if (!val || val === 'NONE') {
                                return '-';
                            }
                            return context.getMessage('app_secure_block_message_type_grid_' + val);
                        }
                    },
                    {
                        "index": "block-message",
                        "name": "block-message",
                        "label": context.getMessage('app_secure_grid_column_block_message_url'),
                        "width": 230,
                        formatter: function (val) {
                            return val || '-';
                        }
                    },
                    {
                        "index":"domain-name",
                         "name":"domain-name",
                         "label":context.getMessage('policy_devices_grid_column_domain'),
                         "width":200
                    },
                    {
                        "index": "description",
                        "name": "description",
                        "label": context.getMessage('grid_column_description'),
                        "collapseContent": {
                            "singleValue" : true
                        },
                        "width": 280
                    }
                ]
            };
        };
    };

    return Configuration;
});
