/**
 * Form configuration for nat policy form
 *
 * @module NAT Policy
 * @author Sandhya B <sandhyab@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    '../../../../../base-policy-management/js/policy-management/policies/conf/basePolicyFormConfiguration.js'
    ], function (BasePolicyFormConfiguration) {

    var natPolicyFormConfiguration = function(context) {

        this.getValues = function() {
            return {
                "title": context.getMessage("grid_create_policy"),
                "form_id": "create_nat_policy_form",
                "form_name": "create_nat_policy_form",
                "title-help": {
                     "content": context.getMessage("nat_policy_create_title_tooltip"),
                     "ua-help-text": context.getMessage('more_link'),
                     "ua-help-identifier": context.getHelpKey("NAT_POLICY_CREATING")
                },
                "err_div_id": "errorDiv",
                "err_div_message": context.getMessage("form_error"),
                //"err_div_link": "http://www.juniper.net/techpubs/en_US/junos12.1x46/topics/task/configuration/j-web-basic-settings.html",
                "err_div_link_text": context.getMessage("nat_policy_create"),
                "err_timeout": "1000",
                "valid_timeout": "5000",
                "on_overlay": true,
                "add_remote_name_validation": 'policy-name',
                "sections": [
                    {
                        "section_id": "nat_policy_basic_form",
                        "elements": [
                            {
                                 "element_text": true,
                                "id": "policy-name",
                                "name": "name",
                                "value": "{{name}}",
                                "label": context.getMessage("name"),
                                "onfocus": "true",
                                "required": true,
                                "pattern": "^[a-zA-Z0-9\-_@#$%&*():. ]{0,255}$",
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
                        "section_id" : "nat_policy_options_form",
                        "elements" : [
                            {
                                "element_checkbox": true,
                                "id": "proxy-arp-managed",
                                "label": context.getMessage("nat_proxy_arp_managed"),
                                 "values": [
                                     {
                                        "id": "proxy-arp-managed",
                                        "name": "proxy-arp-managed",
                                        "label": context.getMessage("enable"),
                                        "value": "enable",
                                        "checked" : true
                                     }
                                 ],
                                "field-help": {
                                    "content": context.getMessage('nat_proxy_arp_tooltip')
                                }
                            },
                            {
                                "element_checkbox": true,
                                "id": "enable-auto-arp",
                                "label": context.getMessage("nat_policy_enable_auto_arp"),
                                 "values": [
                                     {
                                        "id": "enable-auto-arp",
                                        "name": "enable-auto-arp",
                                        "label": context.getMessage("enable"),
                                        "value": "enable",
                                        "checked" : false
                                     }
                                 ],
                                "field-help": {
                                    "content": context.getMessage('nat_policy_autoarp_tooltip')
                                }
                            }
                        ]
                    },
                    
                    //Add all the common options in create of a policy
                    //Not able to add multiple sections in single method, so adding in multiple methods
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

    return natPolicyFormConfiguration;

});