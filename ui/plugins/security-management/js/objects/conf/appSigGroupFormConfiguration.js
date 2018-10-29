/**
 * Created by vinutht on 5/14/15.
 */


define([],
    function() {
        var Configuration = function(context) {
             this.getValues = function() {
                return {
                    "form_id": "sd_appsig_group_form",
                    "form_name": "sd_appsig_group_form",
                    "on_overlay": true,
                    "title-help": {
                        "content": context.getMessage("app_sig_form_title_help"),
                        "ua-help-text": context.getMessage('more_link'),
                        "ua-help-identifier": context.getHelpKey("FIREWALL_POLICY_APPLICATION_SIGNATURE_CREATING")
                    },
                    "err_div_id": "errorDiv",
                    "err_div_message": context.getMessage("form_error"),
                    "err_div_link": "http://www.juniper.net/techpubs/en_US/junos12.1x46/topics/task/configuration/j-web-basic-settings.html",
                    "err_div_link_text": "Create Application Signature Group help",
                    "err_timeout": "1000",
                    "valid_timeout": "5000",
                    "add_remote_name_validation": 'app-sig-group-name',
                    "sections": [
                        {
                            "elements": [

                                {
                                    "element_multiple_error": true,
                                    "name": "name",
                                    "label": "Name",
                                    "id": "app-sig-group-name",
                                    "required": true,
                                    "value": "{{name}}",
                                    "error": context.getMessage("app_sig_create_name_length_error"),
                                    "help": context.getMessage('app_sig_create_name_help'),
                                    "field-help": {
                                         "content": context.getMessage('app_sig_name_field_help'),
                                         "ua-help-identifier": "utm_web_filtering_safe_search_tooltip"
                                    },
                                    "pattern-error": [
                                        {
                                            "pattern": "length",
                                            "min_length":"1",
                                            "max_length":"63",
                                            "error": context.getMessage("app_sig_create_name_length_error")
                                        },
                                        {
                                            "pattern": "hasnotspace",
                                            "error": context.getMessage("name_no_space_validate")
                                        }]
                                },
                                {
                                     "element_description": true,
                                    "id": "app-sig-selection-grid",
                                    "class": "app-sig-selection-grid",
                                    "name": "app-sig-selection-grid",
                                    "label": context.getMessage('app_sig_group_members'),
                                    "field-help": {
                                         "content": context.getMessage('app_sig_group_members_help'),
                                         "ua-help-identifier": "utm_web_filtering_safe_search_tooltip"
                                    }
                                }
                            ]
                        }
                    ],
                    "buttonsAlignedRight": true,
                    "buttonsClass":"buttons_row",
                    "cancel_link": {
                        "id": "sd-appsig-cancel",
                        "value": context.getMessage('cancel')
                    },
                    "buttons": [
                        {
                            "id": "sd-appsig-save",
                            "name": "create",
                            "value": context.getMessage('ok')
                        }
                    ]
                };
            }
        };

        return Configuration;
    }
);
