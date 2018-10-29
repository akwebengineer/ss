define([
    'text!../templates/ipsPolicyTemplate.html',
    '../constants/ipsPolicyTemplatesConstants.js',
    '../../../../../ui-common/js/common/restApiConstants.js',
    '../../../../../ui-common/js/common/gridConfigurationConstants.js'
], function (PolicyTemplate, IpsPolicyTemplatesConstant, RestApiConstants, GridConfigurationConstants) {
    var IpsPolicyTemplatesGridConf = function(context){
         //defined to get the rules link
        this.linkToRules = function (cellValue, options, rowObject) {
            return Slipstream.SDK.Renderer.render(PolicyTemplate,{"policyId": rowObject.id, "cellValue": cellValue});
        },

         this.getValues= function(){
            var me = this,linkToRules = me.linkToRules;
            return {
                "title": context.getMessage('ips_policy_templates_grid_title'),
                "title-help": {
                    "content": context.getMessage('ips_policy_templates_grid_tooltip'),
                    "ua-help-text": context.getMessage('more_link'),
                    "ua-help-identifier": context.getHelpKey("IPS_POLICY_TEMPLATE_CREATING")
                },
                "tableId": "ipsPolicyTemplate-grid",
                "height": GridConfigurationConstants.TABLE_HEIGHT,
                "numberOfRows": GridConfigurationConstants.PAGE_SIZE,
                "scroll": true,
                "multiselect": "true",
                "sorting": [ 
                    {
                    "column": "name",
                    "order": "asc"
                    }
                ],
                "jsonId": "id",
                "url": IpsPolicyTemplatesConstant.IPS_POLICY_TEMPLATE_URL,
                "jsonRoot": "policy-templates.policy-template",
                "jsonRecords": function(data) {
                        return data['policy-templates'][RestApiConstants.TOTAL_PROPERTY];
                },
                "ajaxOptions": {
                    "headers": {
                        "Accept":IpsPolicyTemplatesConstant.IPS_POLICY_TEMPLATES_ACCEPT_HEADER
                    }
                },
                "contextMenu": {
                    "edit": context.getMessage('ips_policy_templates_grid_edit'),
                    "delete": context.getMessage('ips_policy_templates_grid_delete')
                },
                "confirmationDialog": {
                    "delete": {
                        title: context.getMessage('ips_policy_template_delete'),
                        question: context.getMessage('ips_policy_template_delete_msg')
                    }
                },
                "filter": {
                    searchUrl: true
                }, 
                "columns": 
                [
                    {
                        "index": "id",
                        "name": "id",
                        "label": context.getMessage('ips_policy_templates_column_id'),
                        "hidden": true
                    },
                    {
                        "index": "name",
                        "name": "name",
                        "label": context.getMessage('ips_policy_templates_column_name'),
                        "width": 300,
                        "formatter": me.linkToRules,
                        "unformat": function (cellValue, options, rowObject) {
                            return cellValue;
                        }
                    },
                    {
                        "index": "rule-count",
                        "name": "rule-count",
                        "label": context.getMessage('grid_column_ruleCount'),
                        "width": 200,
                         formatter: function (cellValue, options, rowObject) {
                            return Slipstream.SDK.Renderer.render(PolicyTemplate, {"policyId": rowObject.id,
                                "cellValue": cellValue?cellValue:0});
                        }
                    },
                    {
                        "index": "description",
                        "name": "description",
                        "label": context.getMessage('ips_policy_templates_description'),
                        "width": 600,
                        "collapseContent": {
                          "singleValue" : true
                        }
                    },
                    {
                        "index": "domain-name",
                        "name": "domain-name",
                        "label": context.getMessage('ips_policy_templates_domain_name'),
                        "width": 200
                    },
                    {
                        "index": "predefined",
                        "name": "predefined",
                        "label": context.getMessage('vpn_profiles_form_field_label_proposalsPredefined'),
                        "hidden": true
                    },
                    {
                    "index": "domain-id",
                    "name": "domain-id",
                    "label": "Domain id",
                    "hidden":true,
                    "width":10
                    }
                ] 
            }
        }        
    };    
    return IpsPolicyTemplatesGridConf;
});
