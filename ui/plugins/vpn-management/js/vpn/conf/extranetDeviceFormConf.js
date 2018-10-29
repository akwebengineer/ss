/**
 * Form configuration required to render an Extranet Device form using the FormWidget.
 *
 * @module ExtranetDeviceFormConf
 * @author Jangul Aslam <jaslam@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
], function(
) {
    var ExtranetDeviceFormConf = {
    };

    ExtranetDeviceFormConf.getConfiguration = function(context, action) {
        return {
            "title": (action == Slipstream.SDK.Intent.action.ACTION_EDIT) ? context.getMessage("extranet_device_form_title_modify") : context.getMessage("extranet_device_form_title"),
            "title-help": {
                "content": context.getMessage("extranet_device_form_title_help"),
                "ua-help-text": context.getMessage('more_link'),
                "ua-help-identifier": context.getHelpKey("VPN_EXTRANET_DEVICE_CREATING")
            },
            "form_id": "extranet-device-settings",
            "form_name": "extranet-device-settings",
            "err_div_id": "errorDiv",
            "err_div_message": context.getMessage("form_error"),
            "err_div_link": "http://www.juniper.net/techpubs/en_US/junos12.1x46/topics/task/configuration/j-web-basic-settings.html",
            "err_div_link_text": "Create Extranet Device help",
            "err_timeout": "1000",
            "valid_timeout": "5000",
            "on_overlay": true,
            "add_remote_name_validation": 'name',
            "sections": [
                {
                 //   "heading": context.getMessage("extranet_device_form_section_heading"),
                    "elements": [
                        {
                            "element_text": true,
                            "id": "name",
                            "name": "name",
                            "label": context.getMessage("extranet_device_form_field_label_name"),
                             "field-help": {
                                "content": context.getMessage("alert_def_form_name_hint")
                            },
                            "value": "{{name}}",
                            "required": true,
                            "pattern": "^[a-zA-Z0-9][a-zA-Z0-9-_.:/]{0,62}$",
                            "error": context.getMessage("extranet_device_name_field_error_required"),
                            "notshowvalid": true,
                          //  "help": context.getMessage("extranet_device_form_field_help_name")
                        },
                        {
                            "element_textarea": true,
                            "id": "description",
                            "name": "description",
                            "label": context.getMessage("extranet_device_form_field_label_description"),
                             "field-help": {
                                "content": "Enter a description for the extranet device; maximum length is 255 characters."
                            },
                            "value": "{{description}}",
                            "help": context.getMessage("extranet_device_form_field_help"),
                            "error": context.getMessage('extranet_device_description_field_error_max_length_name'),
                            "pattern": "^[\\s\\S]{1,255}$"
                            //"help": context.getMessage("extranet_device_form_field_help_description")
                        }
                    ]
                },
                {
                    "heading": "",
             //       "heading_text": context.getMessage("extranet_device_form_section_heading_text"),
                    "elements": [
                        {
                            "element_multiple_error": true,
                            "id": "ip-address",
                            "name": "ip-address",
                            "label": context.getMessage("extranet_device_form_field_label_ip-address"),
                            "field-help": {
                                "content": context.getMessage("extranet_device_form_field_help_description")
                            },
                            "value": "{{ip-address}}",
                            "placeholder": context.getMessage("extranet_device_form_field_placeholder_ip-address"),
                            "error": true,
                            "pattern-error": [
                                {
                                    "pattern": "ipv4",
                                    "error": context.getMessage("extranet_device_form_field_error_ip-address")
                                }
                            ],
                            "notshowvalid": true,
                            //"help": context.getMessage("extranet_device_form_field_help_ip-address")
                        },
                        {
                            "element_text": true,
                            "id": "host-name",
                            "name": "host-name",
                            "label": context.getMessage("extranet_device_form_field_label_host-name"),
                             "field-help": {
                                "content": "Enter a DNS resolvable hostname for the extranet device."
                            },
                            "value": "{{host-name}}",
                            "pattern": "^[a-zA-Z0-9-.]{0,63}$",
                            "error": context.getMessage("extranet_device_form_field_error"),
                            "notshowvalid": true,
                        }
                    ]
                }
            ],
            "buttonsAlignedRight": true,
            "buttons": [
                {
                    "id": "ok",
                    "name": "ok",
                    "value": context.getMessage("ok")
                }
            ],
            "cancel_link": {
                "id": "cancel",
                "value": context.getMessage("cancel"),
            }
        };
    }

    return ExtranetDeviceFormConf;
});

