/**
 * Form configuration required to render the general form using the FormWidget.
 *
 * @module General Form Configuration
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([], function () {

   var NAME_MAX_LENGTH = 29,
            NAME_MIN_LENGTH = 1,
            DESCRIPTION_MAX_LENGTH = 255,
            CUSTOM_NOTIFICATION_MESSAGE_MAX_LENGTH = 512;

        var Configuration = function(context) {

            this.getValues = function() {

                return {
                   "form_id": "utm-contentfiltering-general-form",
                   "form_name": "utm-contentfiltering-general-form",
                   "add_remote_name_validation": 'utm-contentfiltering-name',
                    "sections": [
                       {
                            "heading": context.getMessage('utm_content_filtering_title_general_information'),
                            "elements": [
                                {
                                    "element_multiple_error": true,
                                    "id": "utm-contentfiltering-name",
                                    "name": "name",
                                    "value": "{{name}}",
                                    "label": context.getMessage('name'),
                                    "required": true,
                                    "field-help": {
                                        "content": context.getMessage('utm_content_filtering_name_tooltip')
                                    },
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
                                    "notshowvalid": true
                                },
                                {
                                    "element_textarea": true,
                                    "id": "utm-contentfiltering-description",
                                    "name": "description",
                                    "value": "{{description}}",
                                    "field-help": {
                                        "content": context.getMessage('utm_content_filtering_description_tooltip')
                                    },
                                    "label": context.getMessage('description'),
                                    "max_length": DESCRIPTION_MAX_LENGTH,
                                    "post_validation": "lengthValidator"
                                }
                            ]
                       },
                       {
                            "heading": context.getMessage('utm_content_filtering_title_notification_options'),
                            "elements": [
                                {
                                    "element_checkbox": true,
                                    "id": "utm-contentfiltering-notify-mail-sender",
                                    "field-help": {
                                        "content": context.getMessage('utm_content_filtering_notify_sender_tooltip')
                                    },
                                    "label": context.getMessage('utm_content_filtering_notify_mail_sender'),
                                    "values": [
                                        {
                                            "id": "notify-mail-sender",
                                            "name": "notify-mail-sender",
                                            "label": "",
                                            "value": "enable"
                                        }
                                    ]
                                },
                                {
                                    "element_dropdown": true,
                                    "id": "notification-type",
                                    "name": "notification-type",
                                    "field-help": {
                                        "content": context.getMessage('utm_content_filtering_notification_type_tooltip')
                                    },
                                    "label": context.getMessage('utm_content_filtering_notification_type'),
                                    "allowClearSelection": true,
                                    "placeholder": context.getMessage('utm_dropdown_placeholder_notification_type'),
                                    "initValue": "NONE",
                                    "values": [{
                                        "label": context.getMessage('utm_content_filtering_notification_type_protocol'),
                                        "value": "PROTOCOL"
                                    }, {
                                        "label": context.getMessage('utm_content_filtering_notification_type_message'),
                                        "value": "MESSAGE"
                                    }]
                                },
                                {
                                    "element_textarea": true,
                                    "id": "custom-notification-message",
                                    "name": "custom-notification-message",
                                    "field-help": {
                                        "content": context.getMessage('utm_content_filtering_notification_message_tooltip')
                                    },
                                    "max_length": CUSTOM_NOTIFICATION_MESSAGE_MAX_LENGTH,
                                    "post_validation": "lengthValidator",
                                    "value": "{{notification-options.custom-notification-message}}",
                                    "label": context.getMessage('utm_content_filtering_custom_notification_message'),
                                    "required": false
                                }
                            ]
                        }
                    ]
                };
            };
        };

        return Configuration;
});