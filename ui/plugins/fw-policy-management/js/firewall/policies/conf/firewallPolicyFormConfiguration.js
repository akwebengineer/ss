/**
 * Form configuration for firewall policy form
 *
 * @module Firewall Policy
 * @author Pei-Yu Yang <pyang@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    '../../../../../base-policy-management/js/policy-management/policies/conf/basePolicyFormConfiguration.js'
    ], function (BasePolicyFormConfiguration) {

    var firewallPolicyFormConfiguration = function(context) {

        this.getValues = function() {
            return {
                "title": context.getMessage("grid_policy_create"),
                "form_id": "create_firewall_policy_form",
                "form_name": "create_firewall_policy_form",
                "title-help": {
                    "content": context.getMessage("fw_policy_create"),
                    "ua-help-text": context.getMessage('more_link'),
                    "ua-help-identifier": context.getHelpKey("FIREWALL_POLICY_CREATING")
                },
                "err_div_id": "errorDiv",
                "err_div_message": context.getMessage("form_error"),
               
                "err_div_link_text": context.getMessage("fw_policy_create"),
                "err_timeout": "1000",
                "valid_timeout": "5000",
                "on_overlay": true,
                "add_remote_name_validation": 'policy-name',
                "sections": [
                    {
                        "heading": context.getMessage("general_information"),
                        "section_id": "firewall_policy_general_section",
                        "elements": [
                            {
                                "element_text": true,
                                "id": "policy-name",
                                "name": "name",
                                "value": "{{name}}",
                                "label": context.getMessage("name"),
                                "onfocus": "true",
                                "required": true,
                                "pattern": /^[a-zA-Z0-9\-_@#$%&*():.]{1}[a-zA-Z0-9\-_@#$%&*():.\s]{0,254}$/,
                                "error": context.getMessage("policy_name_error"),
                                "field-help": {
                                    "content": context.getMessage('policy_name_tooltip')
                                }
                            },
                            {
                                "element_textarea": true,
                                "id": "description",
                                "value": "{{description}}",
                                "name": "description",
                                "label": context.getMessage("description"),
                                "max_length": 255,
                                "post_validation": "descriptionValidator",
                                "placeholder": "",
                                "field-help": {
                                    "content": context.getMessage('policy_description_tooltip')
                                }
                            }
                        ]
                    },
                    {
                        "heading": context.getMessage("policy_options"),
                        "section_id" : "firewall_policy_options_section",
                        "elements" : [
                            {
                                "element_description": true,
                                "value": '<select class="firewall-policy-profiles"></select>',
                                "id": "policy-profile",
                                "name": "policy-profile",
                                "required": false,
                                "label": context.getMessage('profile'),
                                "field-help": {
                                    "content": context.getMessage('policy_profile_tooltip')
                                }
                            }             
                        ]
                    },
                    
                    new BasePolicyFormConfiguration(context).getPolicyTypeSection(),
                    new BasePolicyFormConfiguration(context).getGroupDeviceSelectionSection(),
                    new BasePolicyFormConfiguration(context).getSingleDeviceSelectionSection(),
                    new BasePolicyFormConfiguration(context).getPolicySequenceSection()
                ],

                "buttonsAlignedRight": true,
                "buttons": [
                    {
                        "id": "btnPolicyOk",
                        "name": "btnPolicyOk",
                        "value": context.getMessage('ok')
                    }
                ],
                "cancel_link": {
                    "id": "linkPolicyCancel",
                    "value": context.getMessage("cancel")
                }
            }
        }
    };

    return firewallPolicyFormConfiguration;

});
