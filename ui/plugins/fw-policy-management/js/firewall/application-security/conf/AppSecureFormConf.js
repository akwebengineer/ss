define([
], function () {

    var NAME_MAX_LENGTH = 63,
        NAME_MIN_LENGTH = 1,
        DESCRIPTION_MAX_LENGTH = 255,
        DESCRIPTION_MIN_LENGTH = 1;

    var Configuration = function (context) {

        this.getValues = function () {

            return {
                "form_id": "app-secure-profile-form",
                "form_name": "app-secure-profile-form",
                "on_overlay": true,
                "title-help": {
                    "content": context.getMessage('applicationSecurity_grid_create_title_tooltip'),
                    "ua-help-text":context.getMessage("more_link"),
                    "ua-help-identifier": context.getHelpKey("APPLICATION_FIREWALL_POLICY_CREATING")
                },
                "add_remote_name_validation": 'app-secure-profile-name',
                "sections": [
                    {
                        "elements": [
                            {
                                "element_text": true,
                                "id": "app-secure-profile-name",
                                "name": "name",
                                "label": context.getMessage('appfw_policy_name'),
                                "required": true,
                                "pattern": "^[a-zA-Z0-9][a-zA-Z0-9-_.:\/]{0,62}$",         
                                "error": context.getMessage('app_fw_name_error'),
                                "notshowvalid": true,
                                "help": context.getMessage("maximum_length_help", [NAME_MAX_LENGTH]),
                                "field-help": {
                                    "content": context.getMessage('applicationSecurity_grid_name_tooltip'),
                                    "ua-help-identifier": "alias_for_ua_event_binding"
                                }
                            },
                            {
                                "element_textarea": true,
                                "id": "app-secure-profile-description",
                                "name": "description",
                                "label": context.getMessage('appfw_policy_description'),
                                "required": false,
                                "error": true,
                                "field-help": {
                                    "content": context.getMessage('applicationSecurity_grid_description_tooltip'),
                                    "ua-help-identifier": "alias_for_ua_event_binding"
                                },
                                "help": context.getMessage("maximum_length_help", [DESCRIPTION_MAX_LENGTH]),
                                "post_validation" : "validTextarea"
                              }
                        ]
                    }
                ],
                "buttonsAlignedRight": true,
                "cancel_link": {
                    "id": "app_secure_profile_cancel",
                    "value": context.getMessage('cancel')
                },
                "buttons": [
                    {
                        "id": "app_secure_profile_save",
                        "name": "save",
                        "value": context.getMessage('ok')
                    }
                ]
            }
        };
    };

    return Configuration;
})
;
