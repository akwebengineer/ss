/**
 * Form configuration required to render the UTM policy Anti-Virus form using the FormWidget.
 *
 * @module UTM policy Anti-virus Configuration
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([], function () {

        var Configuration = function(context) {

            this.getValues = function() {

                return {
                   "form_id": "utm-policy-anti-virus-form",
                   "form_name": "utm-policy-anti-virus-form",
                    "sections": [
                       {
                            //"heading_text": context.getMessage('utm_policy_anti_virus_text'),
                            "elements": [
                              {
                                 "element_checkbox": true,
                                 "label": context.getMessage('utm_policy_apply_all_protocols'),
                                 "field-help": {
                                     "content": context.getMessage('utm_policy_apply_to_all_protocol_tooltip'),
                                     "ua-help-identifier": "utm_policy_apply_to_all_protocol_tooltip"
                                 },
                                 "values": [
                                     {
                                         "id": "checkbox_apply_to_all_protocol_av",
                                         "name": "checkbox_apply_to_all_protocol_av",
                                         "label": ""
                                     }
                                 ]
                               },
                               {
                                "element_dropdown": true,
                                "id": "dropdown_av_protocol_http",
                                "name": "dropdown_av_protocol_http",
                                "label": context.getMessage('utm_policy_http'),
                                "class": "specific-protocols dropdown-antivirus",
                                "allowClearSelection": true,
                                "placeholder": context.getMessage('utm_dropdown_placeholder_common'),
                                "values": [{
                                    "label": context.getMessage('utm_policy_create_new_profile'),
                                    "value": "create_new_profile"
                                }]
                            },
                            {
                                "element_dropdown": true,
                                "id": "dropdown_av_protocol_ftp_upload",
                                "name": "dropdown_av_protocol_ftp_upload",
                                "label": context.getMessage('utm_policy_ftp_upload'),
                                "class": "specific-protocols dropdown-antivirus",
                                "allowClearSelection": true,
                                "placeholder": context.getMessage('utm_dropdown_placeholder_common'),
                                "values": [{
                                    "label": context.getMessage('utm_policy_create_new_profile'),
                                    "value": "create_new_profile"
                                }]
                            },
                            {
                                "element_dropdown": true,
                                "id": "dropdown_av_protocol_ftp_download",
                                "name": "dropdown_av_protocol_ftp_download",
                                "label": context.getMessage('utm_policy_ftp_download'),
                                "class": "specific-protocols dropdown-antivirus",
                                "allowClearSelection": true,
                                "placeholder": context.getMessage('utm_dropdown_placeholder_common'),
                                "values": [{
                                    "label": context.getMessage('utm_policy_create_new_profile'),
                                    "value": "create_new_profile"
                                }]
                            },
                            {
                                "element_dropdown": true,
                                "id": "dropdown_av_protocol_imap",
                                "name": "dropdown_av_protocol_imap",
                                "label": context.getMessage('utm_policy_imap'),
                                "class": "specific-protocols dropdown-antivirus",
                                "allowClearSelection": true,
                                "placeholder": context.getMessage('utm_dropdown_placeholder_common'),
                                "values": [{
                                    "label": context.getMessage('utm_policy_create_new_profile'),
                                    "value": "create_new_profile"
                                }]
                            },
                            {
                                "element_dropdown": true,
                                "id": "dropdown_av_protocol_smtp",
                                "name": "dropdown_av_protocol_smtp",
                                "label": context.getMessage('utm_policy_smtp'),
                                "class": "specific-protocols dropdown-antivirus",
                                "allowClearSelection": true,
                                "placeholder": context.getMessage('utm_dropdown_placeholder_common'),
                                "values": [{
                                    "label": context.getMessage('utm_policy_create_new_profile'),
                                    "value": "create_new_profile"
                                }]
                            },
                            {
                                "element_dropdown": true,
                                "id": "dropdown_av_protocol_pop3",
                                "name": "dropdown_av_protocol_pop3",
                                "label": context.getMessage('utm_policy_pop3'),
                                "class": "specific-protocols dropdown-antivirus",
                                "allowClearSelection": true,
                                "placeholder": context.getMessage('utm_dropdown_placeholder_common'),
                                "values": [{
                                    "label": context.getMessage('utm_policy_create_new_profile'),
                                    "value": "create_new_profile"
                                }]
                            },
                            {
                                "element_dropdown": true,
                                "id": "dropdown_av_protocol_default",
                                "name": "dropdown_av_protocol_default",
                                "label": context.getMessage('utm_policy_default'),
                                "class": "default-protocol dropdown-antivirus",
                                "allowClearSelection": true,
                                "placeholder": context.getMessage('utm_dropdown_placeholder_common'),
                                "values": [{
                                    "label": context.getMessage('utm_policy_create_new_profile'),
                                    "value": "create_new_profile"
                                }]
                            },
                            {
                                "element_description": true,
                                "id": "policy_anti_virus_profile_create",
                                "name": "policy_anti_virus_profile_create",
                                "label": ""
                            }]
                       }
                    ]
                };
            };
        };

        return Configuration;
});