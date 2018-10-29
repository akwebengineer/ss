/**
 * A configuration object with the parameters required to build
 * a form for anti-spam profile
 *
 * @module antispamFormConfiguration
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
], function () {

    var NAME_MAX_LENGTH = 29,
        NAME_MIN_LENGTH = 1,
        DESCRIPTION_MAX_LENGTH = 255,
        CUSTOM_TAG_MAX_LENGTH = 512;

    var Configuration = function(context) {

        this.getValues = function() {

            return {
                "form_id": "utm-antispam-form",
                "form_name": "utm-antispam-form",
                "title-help": {
                    "content": context.getMessage('utm_antispam_create_title_tooltip'),
                    "ua-help-text": context.getMessage('more_link'),
                    "ua-help-identifier": context.getHelpKey("UTM_ANTISPAM_PROFILE_CREATING")
                },
                "on_overlay": true,
                "add_remote_name_validation": 'utm-antispam-name',
                "sections": [
                   {
                        "heading": context.getMessage('utm_antispam_title_general_information'),
                        "elements": [
                             {
                                 "element_multiple_error": true,
                                 "id": "utm-antispam-name",
                                 "name": "name",
                                 "value": "{{name}}",
                                 "label": context.getMessage('name'),
                                 "required": true,
                                 "pattern-error": [
                                      {
                                          "pattern": "validtext",
                                          "error": context.getMessage('name_require_error')
                                      },
                                      {
                                          "pattern": "length",
                                          "max_length": NAME_MAX_LENGTH,
                                          "min_length": NAME_MIN_LENGTH,
                                          "error": context.getMessage("maximum_length_error", [NAME_MAX_LENGTH])
                                      }
                                 ],
                                 "error": true,
                                 "post_validation": "blankNameValidator",
                                 "notshowvalid": true,
                                 "field-help": {
                                     "content": context.getMessage('utm_antispam_name_tooltip')
                                 }
                             },
                             {
                                 "element_textarea": true,
                                 "id": "utm-antispam-description",
                                 "name": "description",
                                 "value": "{{description}}",
                                 "label": context.getMessage('description'),
                                 "max_length": DESCRIPTION_MAX_LENGTH,
                                 "post_validation": "lengthValidator",
                                 "field-help": {
                                     "content": context.getMessage('utm_antispam_description_tooltip')
                                 }
                             },
                             {
                                 "element_checkbox": true,
                                 "id": "utm-antispam-black-list",
                                 "label": context.getMessage('utm_antispam_default_sbl_server'),
                                 "field-help": {
                                     "content": context.getMessage('utm_antispam_default_sbl_server_tooltip'),
                                     "ua-help-identifier": "utm_antispam_default_sbl_server_tooltip"
                                 },
                                 "values": [
                                     {
                                         "id": "default-sbl-server",
                                         "name": "default-sbl-server",
                                         "label": context.getMessage('checkbox_enable'),
                                         "value": "enable",
                                         "checked": true
                                     }
                                 ]
                             }
                        ]
                   },
                   {
                        "heading": context.getMessage('utm_antispam_title_action'),
                        "elements": [
                            {
                                "element_dropdown": true,
                                "id": "default-action",
                                "name": "default-action",
                                "initValue": "{{default-action}}",
                                "label": context.getMessage('utm_antispam_default_action'),
                                "values": [
                                    {
                                        "label": context.getMessage('utm_antispam_grid_action_tag_subject'),
                                        "value": "TAG_SUBJECT"
                                    },
                                    {
                                        "label": context.getMessage('utm_antispam_grid_action_tag_header'),
                                        "value": "TAG_HEADER"
                                    },
                                    {
                                        "label": context.getMessage('utm_antispam_grid_action_block_email'),
                                        "value": "BLOCK_EMAIL"
                                    },
                                    {
                                        "label": context.getMessage('utm_antispam_grid_action_none'),
                                        "value": "NONE"
                                    }
                                ],
                                "field-help": {
                                    "content": context.getMessage('utm_antispam_default_action_tooltip')
                                }
                            },
                            {
                                "element_textarea": true,
                                "id": "tag-string",
                                "name": "tag-string",
                                "max_length": CUSTOM_TAG_MAX_LENGTH,
                                "post_validation": "lengthValidator",
                                "label": context.getMessage('utm_antispam_custom_tag'),
                                "value": "{{tag-string}}",
                                "field-help": {
                                    "content": context.getMessage('utm_antispam_custom_tag_tooltip')
                                }
                            }
                        ]
                    }
                ],
                "buttonsAlignedRight": true,
                "cancel_link": {
                    "id": "utm-antispam-cancel",
                    "value": context.getMessage('cancel')
                },
                "buttons": [
                    {
                        "id": "utm-antispam-save",
                        "name": "save",
                        "value": context.getMessage('ok')
                    }
                ]
            };
        };
    };

    return Configuration;
});