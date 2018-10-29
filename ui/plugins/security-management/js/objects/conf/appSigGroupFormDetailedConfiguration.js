/**
 * Created by ramesha on 8/31/15.
 */


define([],
    function() {
        var Configuration = function(context) {
            this.getValues = function() {
                return {
                    "form_id": "sd_appsig_group_form",
                    "form_name": "sd_appsig_group_form",
                    "on_overlay": true,
                    "err_div_id": "errorDiv",
                    "err_div_message": context.getMessage("form_error"),
                    "err_div_link": "http://www.juniper.net/techpubs/en_US/junos12.1x46/topics/task/configuration/j-web-basic-settings.html",
                    "err_div_link_text": "Create Application Signature Group help",
                    "err_timeout": "1000",
                    "valid_timeout": "5000",
                    "sections": [{
                            "elements": [{
                                    "element_description": true,
                                    "name": "name",
                                    "label": "Name",
                                    "id": "app-sig-group-name",
                                    "value": "{{name}}"
                                }]
                    },
                    {
                       "section_id": "sd_appsig_SigDetailsSectionAdvanced",
                                "elements": [
                            {
                                "element_description": true,
                                "id": "app-sig-protocol-grid",
                                "class": "hide grid-widget",
                                "name": "app-sig-protocol-grid",
                                "label": context.getMessage('app_sig_group_members')
                            }

                        ]
                    }
                    ],
                    "buttonsAlignedRight": true,
                    "buttonsClass":"buttons_row",
                    "buttons": [
                        {
                            "id": "sd-appsig-cancel",
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
