/**
 * A configuration object with the parameters required to build
 * a form for anti-virus profile modify form configuration
 *
 * @module antiVirusModifyFormConfiguration
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
], function () {

    var NAME_MAX_LENGTH = 29,
        NAME_MIN_LENGTH = 1,
        CUSTOM_TAG_MAX_LENGTH = 512,
        CUSTOM_NOTIFICATION_SUBJECT_MAX_LENGTH = 255,
        CUSTOM_NOTIFICATION_MESSAGE_MAX_LENGTH = 512,
        DESCRIPTION_MAX_LENGTH = 255,
        CONTENT_SIZE_MIN = 20,
        CONTENT_SIZE_MAX = 40000,
        TIMEOUT_MIN = 0,
        TIMEOUT_MAX = 600,
        SUBJECT_LENGTH_MAX = 255,
        MESSAGE_LENGTH_MAX = 512,
        EMAIL_LENGTH_MAX = 512;

    var Configuration = function(context) {

        this.getValues = function() {

            return {
               "form_id": "utm-antivirus-form",
               "form_name": "utm-antivirus-form",
               "on_overlay": true,
               "add_remote_name_validation": 'name',
               "sections": [
                           {
                                "heading": context.getMessage('utm_antivirus_general_heading'),
                                "elements": [
                                {
                                    "element_multiple_error": true,
                                    "id": "name",
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
                                    "notshowvalid": true,
                                    "help": context.getMessage("maximum_length_help", [NAME_MAX_LENGTH]),
                                    "field-help": {
                                        "content": context.getMessage('utm_antivirus_name_tooltip')
                                    }
                                },
                            {
                                "element_textarea": true,
                                "id": "description",
                                "name": "description",
                                "value": "{{description}}",
                                "label": context.getMessage('description'),
                                "max_length": DESCRIPTION_MAX_LENGTH,
                                "post_validation": "lengthValidator",
                                "field-help": {
                                    "content": context.getMessage('utm_antivirus_description_tooltip')
                                }
                            },
                             {
                                 "element_text": true,
                                 "id": "dropdown_engine_type",
                                 "name": "dropdown_engine_type",
                                 "label": context.getMessage('utm_antivirus_engine_type'),
                                 "value": "{{profile-type}}",
                                 "field-help": {
                                     "content": context.getMessage('utm_antivirus_engine_type_tooltip')
                                 },
                                 "required": true,
                             },
                             {
                                 "element_integer": true,
                                 "id": "timeout",
                                 "name": "timeout",
                                 "value": "{{trickling-timeout}}",
                                 "post_validation": "rangeValidator",
                                 "minValue": TIMEOUT_MIN,
                                 "maxValue": TIMEOUT_MAX,
                                 "label": context.getMessage('utm_antivirus_timeout'),
                                 "help": context.getMessage("utm_antivirus_timeout_help"),
                                 "error": context.getMessage('integer_error'),
                                 "required": false
                             },
                        ]
                   },
                   {
                       "heading": context.getMessage('utm_antivirus_scan_options'),
                       "section_id": "section_scan_option",
                       "state_collapsed": true,
                       "elements": [
                            {
                                "element_integer": true,
                                "id": "anti_virus_content_size_limit",
                                "name": "anti_virus_content_size_limit",
                                "value": "{{scan-options.content-size-limit}}",
                                "post_validation": "rangeValidator",
                                "minValue": CONTENT_SIZE_MIN,
                                "maxValue": CONTENT_SIZE_MAX,
                                "label": context.getMessage('utm_antivirus_content_size_limit'),
                                "help": context.getMessage("utm_antivirus_size_limit_help"),
                                "error": context.getMessage('integer_error'),
                                "required": false,
                                "field-help": {
                                    "content": context.getMessage('utm_antivirus_content_size_limit_tooltip')
                                }
                            },
                            {
                                "element_textarea": true,
                                "id": "anti_virus_file_extension",
                                "name": "anti_virus_file_extension",
                                "value": "{{scan-options.scan-file-extension}}",
                                "label": context.getMessage('utm_antivirus_file_extension'),
                                "class": "kaspersky-type-specific-settings",
                                "post_validation": "fileExtensionListValidator",
                                "placeholder": context.getMessage('utm_antivirus_file_extensions_placeholder'),
                                "help": context.getMessage('utm_antivirus_file_extension_help')
                            }
                        ]
                    },
                    {
                        "heading": context.getMessage('utm_antivirus_fallback_heading'),
                        "state_collapsed": true,
                         "elements": [
                              {
                                "element_dropdown": true,
                                "id": "dropdown_default_action",
                                "name": "dropdown_default_action",
                                "label": context.getMessage('utm_antivirus_default_action'),
                                "allowClearSelection": true,
                                "placeholder": context.getMessage('utm_dropdown_placeholder_common'),
                                "values": [{
                                    "label": context.getMessage('utm_antivirus_log_and_permit'),
                                    "value": "LOG_AND_PERMIT"
                                }, {
                                    "label": context.getMessage('utm_antivirus_block'),
                                    "value": "BLOCK"
                                }],
                                "field-help": {
                                    "content": context.getMessage('utm_antivirus_default_action_tooltip')
                                }
                             },
                             {
                                 "element_dropdown": true,
                                 "id": "dropdown_content_size",
                                 "name": "dropdown_content_size",
                                 "label": context.getMessage('utm_antivirus_content_size'),
                                 "allowClearSelection": true,
                                 "placeholder": context.getMessage('utm_dropdown_placeholder_common'),
                                 "values": [{
                                     "label": context.getMessage('utm_antivirus_log_and_permit'),
                                     "value": "LOG_AND_PERMIT"
                                 }, {
                                     "label": context.getMessage('utm_antivirus_block'),
                                     "value": "BLOCK"
                                 }],
                                 "field-help": {
                                     "content": context.getMessage('utm_antivirus_content_size_tooltip')
                                 }
                             },
                             {
                                 "element_dropdown": true,
                                 "id": "dropdown_engine_error",
                                 "name": "dropdown_engine_error",
                                 "label": context.getMessage('utm_antivirus_engine_error'),
                                 "allowClearSelection": true,
                                 "placeholder": context.getMessage('utm_dropdown_placeholder_common'),
                                 "values": [{
                                     "label": context.getMessage('utm_antivirus_log_and_permit'),
                                     "value": "LOG_AND_PERMIT"
                                 }, {
                                     "label": context.getMessage('utm_antivirus_block'),
                                     "value": "BLOCK"
                                 }],
                                 "field-help": {
                                     "content": context.getMessage('utm_antivirus_engine_error_tooltip')
                                 }
                             },
                             {
                                 "element_dropdown": true,
                                 "id": "dropdown_password",
                                 "name": "dropdown_password",
                                 "class": "kaspersky-type-specific-settings",
                                 "label": context.getMessage('utm_antivirus_password'),
                                 "allowClearSelection": true,
                                 "placeholder": context.getMessage('utm_dropdown_placeholder_common'),
                                 "values": [{
                                     "label": context.getMessage('utm_antivirus_log_and_permit'),
                                     "value": "LOG_AND_PERMIT"
                                 }, {
                                     "label": context.getMessage('utm_antivirus_block'),
                                     "value": "BLOCK"
                                 }]
                             },
                             {
                                 "element_dropdown": true,
                                 "id": "dropdown_corrupt",
                                 "name": "dropdown_corrupt",
                                 "label": context.getMessage('utm_antivirus_corrupt'),
                                 "class": "kaspersky-type-specific-settings",
                                 "allowClearSelection": true,
                                 "placeholder": context.getMessage('utm_dropdown_placeholder_common'),
                                 "values": [{
                                     "label": context.getMessage('utm_antivirus_log_and_permit'),
                                     "value": "LOG_AND_PERMIT"
                                 }, {
                                     "label": context.getMessage('utm_antivirus_block'),
                                     "value": "BLOCK"
                                 }]
                             },
                             {
                                 "element_dropdown": true,
                                 "id": "dropdown_decompress",
                                 "name": "dropdown_decompress",
                                 "label": context.getMessage('utm_antivirus_decompress'),
                                 "class": "kaspersky-type-specific-settings",
                                 "allowClearSelection": true,
                                 "placeholder": context.getMessage('utm_dropdown_placeholder_common'),
                                 "values": [{
                                     "label": context.getMessage('utm_antivirus_log_and_permit'),
                                     "value": "LOG_AND_PERMIT"
                                 }, {
                                     "label": context.getMessage('utm_antivirus_block'),
                                     "value": "BLOCK"
                                 }]
                             }
                         ]
                     },
                     {
                         "heading": context.getMessage('utm_antivirus_notification_heading'),
                         "state_collapsed": true,
                          "elements": [
                              {
                                   "element_text": true,
                                   "id": "text_label_fallback_block",
                                   "name": "text_label_fallback_block",
                                   "label": context.getMessage('utm_antivirus_fallback_block')
                              },
                              {
                                  "element_checkbox": true,
                                  "values": [
                                      {
                                          "id": "checkbox_fallback_deny",
                                          "name": "checkbox_fallback_deny",
                                          "label": context.getMessage('utm_antivirus_notify_sender')
                                      }
                                  ]
                              },
                              {
                                  "element_dropdown": true,
                                  "id": "dropdown_fallback_notify_type",
                                  "name": "dropdown_fallback_notify_type",
                                  "label": context.getMessage('utm_antivirus_notify_type'),
                                  "class": "fallback-deny-settings",
                                  "allowClearSelection": true,
                                  "placeholder": context.getMessage('utm_dropdown_placeholder_notification_type'),
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
                                  "post_validation": "lengthValidator",
                                  "max_length": SUBJECT_LENGTH_MAX,
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
                                  "max_length": MESSAGE_LENGTH_MAX,
                                  "value": "{{fallback-block-notification-options.fallback-block-notification-option.custom-notification-message}}",
                                  "post_validation": "lengthValidator",
                                  "label": context.getMessage('utm_antivirus_nitification_message'),
                                  "class": "fallback-deny-settings",
                                  "post_validation": "lengthValidator",
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
                              },
                              {
                                  "element_text": true,
                                  "id": "text_label_non_fallback_block",
                                  "name": "text_label_non_fallback_block",
                                  "label": context.getMessage('utm_antivirus_fallback_non_block')
                             },
                              {
                                  "element_checkbox": true,
                                  "values": [{
                                      "id": "checkbox_fallback_non_deny",
                                      "name": "checkbox_fallback_non_deny",
                                      "label":context.getMessage('utm_antivirus_notify_recipient')
                                  }]
                              },
                              {
                                  "element_text": true,
                                  "id": "fallback_non_deny_subject",
                                  "name": "fallback_non_deny_subject",
                                  "value": "{{fallback-non-block-notification-options.custom-notification-subject}}",
                                  "label":context.getMessage('utm_antivirus_nitification_subject'),
                                  "class": "fallback-non-deny-settings",
                                  "post_validation": "lengthValidator",
                                  "max_length": SUBJECT_LENGTH_MAX,
                                  "pattern": ".*",
                                  "error": context.getMessage('maximum_length_error', [CUSTOM_NOTIFICATION_SUBJECT_MAX_LENGTH]),
                                  "help": context.getMessage("maximum_length_help", [CUSTOM_NOTIFICATION_SUBJECT_MAX_LENGTH])
                              },
                              {
                                  "element_textarea": true,
                                  "id": "fallback_non_deny_message",
                                  "name": "fallback_non_deny_message",
                                  "max_length": MESSAGE_LENGTH_MAX,
                                  "value": "{{fallback-non-block-notification-options.custom-notification-message}}",
                                  "post_validation": "lengthValidator",
                                  "label":context.getMessage('utm_antivirus_nitification_message'),
                                  "class": "fallback-non-deny-settings",
                                  "post_validation": "lengthValidator",
                                  "help": context.getMessage("maximum_length_help", [CUSTOM_NOTIFICATION_MESSAGE_MAX_LENGTH])
                              },
                              {
                                  "element_text": true,
                                  "id": "text_label_virus_detection",
                                  "name": "text_label_virus_detection",
                                  "label": context.getMessage('utm_antivirus_virus_detection')
                             },
                                {
                                    "element_checkbox": true,
                                    "values": [
                                        {
                                            "id": "checkbox_virus_detection",
                                            "name": "checkbox_virus_detection",
                                            "label": context.getMessage('utm_antivirus_notify_sender')
                                        }
                                    ]
                                },
                                {
                                    "element_dropdown": true,
                                    "id": "dropdown_virus_notify_type",
                                    "name": "dropdown_virus_notify_type",
                                    "label": context.getMessage('utm_antivirus_notify_type'),
                                    "class": "virus-detected-settings",
                                    "allowClearSelection": true,
                                    "placeholder": context.getMessage('utm_dropdown_placeholder_notification_type'),
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
                                    "value": "{{virus-detection-notification-options.custom-notification-subject}}",
                                    "post_validation": "lengthValidator",
                                    "max_length": SUBJECT_LENGTH_MAX,
                                    "label": context.getMessage('utm_antivirus_nitification_subject'),
                                    "class": "virus-detected-settings",
                                    "pattern": ".*",
                                    "error": context.getMessage('maximum_length_error', [CUSTOM_NOTIFICATION_SUBJECT_MAX_LENGTH]),
                                    "help": context.getMessage("maximum_length_help", [CUSTOM_NOTIFICATION_SUBJECT_MAX_LENGTH])
                                },
                                {
                                    "element_textarea": true,
                                    "id": "virus_detected_message",
                                    "name": "virus_detected_message",
                                    "value": "{{virus-detection-notification-options.custom-notification-message}}",
                                    "post_validation": "lengthValidator",
                                    "max_length": MESSAGE_LENGTH_MAX,
                                    "label": context.getMessage('utm_antivirus_nitification_message'),
                                    "class": "virus-detected-settings",
                                    "post_validation": "lengthValidator",
                                    "help": context.getMessage("maximum_length_help", [CUSTOM_NOTIFICATION_MESSAGE_MAX_LENGTH])
                                }
                          ]
                      }
                ],
                "buttonsAlignedRight": true,
                "cancel_link": {
                    "id": "utm-antivirus-cancel",
                    "value": context.getMessage('cancel')
                },
                "buttons": [
                    {
                        "id": "utm-antivirus-save",
                        "name": "save",
                        "value": context.getMessage('ok')
                    }
                ]
            };
        };
    };

    return Configuration;
});