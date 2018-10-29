/**
 * Form configuration required to render UTM Anti-Virus Notification form using the FormWidget.
 *
 * @module UTM Anti-Virus Notification Form Configuration
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([], function () {

    var CUSTOM_NOTIFICATION_SUBJECT_MAX_LENGTH = 255,
    CUSTOM_NOTIFICATION_MESSAGE_MAX_LENGTH = 512;

    var Configuration = function(context) {
        var SUBJECT_LENGTH_MAX = 255,
        MESSAGE_LENGTH_MAX = 512,
        EMAIL_LENGTH_MAX = 512;

        this.getValues = function() {
        return {
           "form_id": "anti-virus-notification-form",
           "form_name": "anti-virus-notification-form",
           "sections": [
           {
               "heading_text": context.getMessage('utm_antivirus_notification_heading_text'),
                "elements": [{}]
           },
           {
            "state_collapsed": true,
            "elements": [
            {
                "element_checkbox": true,
                "label": context.getMessage('utm_antivirus_fallback_deny_heading'),
                "values": [
                    {
                        "id": "checkbox_fallback_deny",
                        "name": "checkbox_fallback_deny",
                        "label": context.getMessage('utm_antivirus_fallback_deny_label')
                    }
                ],
                "field-help": {
                    "content": context.getMessage('utm_antivirus_fallback_deny_tooltip')
                }
            },
            {
                "element_dropdown": true,
                "id": "dropdown_fallback_notify_type",
                "name": "dropdown_fallback_notify_type",
                "label": context.getMessage('utm_antivirus_notify_type'),
                "class": "fallback-deny-settings",
                "allowClearSelection": true,
                "placeholder": context.getMessage("utm_dropdown_placeholder_notification_type"),
                "values": [{
                    "label": context.getMessage('utm_antivirus_protocol'),
                    "value": "PROTOCOL"
                }, {
                    "label": context.getMessage('utm_antivirus_message'),
                    "value": "MESSAGE"
                }]
            }, 
            {
                "element_text": true,
                "id": "fallback_deny_subject",
                "name": "fallback_deny_subject",
                "value": "{{fallback-block-notification-options.fallback-block-notification-option.custom-notification-subject}}",
                "max_length": SUBJECT_LENGTH_MAX,
                "post_validation": "lengthValidator",
                "label": context.getMessage('utm_antivirus_nitification_subject'),
                "class": "fallback-deny-settings",
                "pattern": ".*",
                "error": context.getMessage('maximum_length_error', [CUSTOM_NOTIFICATION_SUBJECT_MAX_LENGTH]),
                "help": context.getMessage("maximum_length_help", [CUSTOM_NOTIFICATION_SUBJECT_MAX_LENGTH])
            },
            {
                "element_textarea": true,
                "id": "fallback_deny_message",
                "name": "fallback_deny_message",
                "value": "{{fallback-block-notification-options.fallback-block-notification-option.custom-notification-message}}",
                "max_length": MESSAGE_LENGTH_MAX,
                "post_validation": "lengthValidator",
                "label": context.getMessage('utm_antivirus_nitification_message'),
                "class": "fallback-deny-settings",
                "help": context.getMessage("maximum_length_help", [CUSTOM_NOTIFICATION_MESSAGE_MAX_LENGTH])
            },
            {
                "element_checkbox": true,
                "label": context.getMessage('utm_antivirus_display_hostname'),
                "class": "fallback-deny-settings",
                "values": [
                    {
                        "id": "checkbox_display_hostname",
                        "name": "checkbox_display_hostname",
                        "label": ""
                    }
                ]
             },
             {
                "element_checkbox": true,
                "label": context.getMessage('utm_antivirus_allow_email'),
                "class": "fallback-deny-settings",
                "values": [
                    {
                        "id": "checkbox_allow_mail",
                        "name": "checkbox_allow_mail",
                        "label": ""
                    }
                ]
             },
             {
                "element_multiple_error": true,
                "id": "fallback_deny_mail",
                "name": "fallback_deny_mail",
                "value": "{{fallback-block-notification-options.administrator-email-address}}",
                "label": context.getMessage('utm_antivirus_email_address'),
                "class": "fallback-deny-settings",
                "error": true,
                "notshowvalid": true,
                "pattern-error": [
                    {
                        "pattern": "email",
                        "error": context.getMessage('email_address_error')
                    },
                    {
                        "pattern": "length",
                        "min_length": '0',
                        "max_length": EMAIL_LENGTH_MAX,
                        "error": context.getMessage('maximum_length_error', [EMAIL_LENGTH_MAX])
                    }
                ]
            }]
        },
        {
            "state_collapsed": true,
            "elements": [
            {
                "element_checkbox": true,
                "label":context.getMessage('utm_antivirus_fallback_non_deny_heading'),
                "values": [{
                    "id": "checkbox_fallback_non_deny",
                    "name": "checkbox_fallback_non_deny",
                    "label":context.getMessage('utm_antivirus_fallback_non_deny_label')
                }],
                "field-help": {
                    "content": context.getMessage('utm_antivirus_fallback_non_deny_tooltip')
                }
            },
            {
                  "element_text": true,
                  "id": "fallback_non_deny_subject",
                  "name": "fallback_non_deny_subject",
                  "max_length": SUBJECT_LENGTH_MAX,
                  "post_validation": "lengthValidator",
                  "label":context.getMessage('utm_antivirus_nitification_subject'),
                  "pattern": ".*",
                  "error": context.getMessage('maximum_length_error', [CUSTOM_NOTIFICATION_SUBJECT_MAX_LENGTH]),
                  "value": "{{fallback-non-block-notification-options.custom-notification-subject}}",
                  "class": "fallback-non-deny-settings",
                  "help": context.getMessage("maximum_length_help", [CUSTOM_NOTIFICATION_SUBJECT_MAX_LENGTH])
              },
              {
                  "element_textarea": true,
                  "id": "fallback_non_deny_message",
                  "name": "fallback_non_deny_message",
                  "post_validation": "lengthValidator",
                  "label":context.getMessage('utm_antivirus_nitification_message'),
                  "value": "{{fallback-non-block-notification-options.custom-notification-message}}",
                  "max_length": MESSAGE_LENGTH_MAX,
                  "class": "fallback-non-deny-settings",
                  "help": context.getMessage("maximum_length_help", [CUSTOM_NOTIFICATION_MESSAGE_MAX_LENGTH])
              }]
        },
        {
            "state_collapsed": true,
            "elements": [
             {
                 "element_checkbox": true,
                 "label": context.getMessage('utm_antivirus_virus_detected_heading'),
                 "values": [
                     {
                         "id": "checkbox_virus_detection",
                         "name": "checkbox_virus_detection",
                         "label": context.getMessage('utm_antivirus_virus_detected_label')
                     }
                 ],
                 "field-help": {
                     "content": context.getMessage('utm_antivirus_virus_detected_tooltip')
                 }
             },
             {
                 "element_dropdown": true,
                 "id": "dropdown_virus_notify_type",
                 "name": "dropdown_virus_notify_type",
                 "label": context.getMessage('utm_antivirus_notify_type'),
                 "class": "virus-detected-settings",
                 "allowClearSelection": true,
                 "placeholder": context.getMessage("utm_dropdown_placeholder_notification_type"),
                 "values": [{
                     "label": context.getMessage('utm_antivirus_protocol'),
                     "value": "PROTOCOL"
                 }, {
                     "label": context.getMessage('utm_antivirus_message'),
                     "value": "MESSAGE"
                 }]
             }, 
             {
                 "element_text": true,
                 "id": "virus_detected_subject",
                 "name": "virus_detected_subject",
                 "post_validation": "lengthValidator",
                 "label": context.getMessage('utm_antivirus_nitification_subject'),
                 "value": "{{virus-detection-notification-options.custom-notification-subject}}",
                 "max_length": SUBJECT_LENGTH_MAX,
                 "pattern": ".*",
                 "error": context.getMessage('maximum_length_error', [CUSTOM_NOTIFICATION_SUBJECT_MAX_LENGTH]),
                 "help": context.getMessage("maximum_length_help", [CUSTOM_NOTIFICATION_SUBJECT_MAX_LENGTH]),
                 "class": "virus-detected-settings"
             },
             {
                 "element_textarea": true,
                 "id": "virus_detected_message",
                 "name": "virus_detected_message",
                 "post_validation": "lengthValidator",
                 "label": context.getMessage('utm_antivirus_nitification_message'),
                 "value": "{{virus-detection-notification-options.custom-notification-message}}",
                 "max_length": MESSAGE_LENGTH_MAX,
                 "help": context.getMessage("maximum_length_help", [CUSTOM_NOTIFICATION_MESSAGE_MAX_LENGTH]),
                 "class": "virus-detected-settings"
                   }]
               }]
           };
       };
    };
    
    return Configuration;
});

