/*
Configuration for setting up the form in demo page
*/
define([
], function () {

    var configurationSample = {};

    configurationSample.elements = {
        "title": "Confirmation Dialog Demo",
        "form_id": "confirmationDialogDemoForm",
        "form_name": "confirmationDialogDemoForm",
        "title-help": {
            "content": "Configure Confirmation Dialog box for demo",
            "ua-help-identifier": "alias_for_title_ua_event_binding"
        },
        "err_div_id": "errorDiv",
        "err_div_message": "One or more fields have errors. Update the fields highlighted below. For detailed information on possible values see",
        "err_div_link":"http://www.juniper.net/techpubs/en_US/junos12.1x46/topics/task/configuration/j-web-basic-settings.html",
        "err_div_link_text":"Configuring Basic Settings",
        "err_timeout": "1000",
        "valid_timeout": "5000",
        "sections": [
            {
                "heading": "Instantiating a new confirmation dialog widget",
                "heading_text": "Fill in options to see the confirmation dialog box",
                "section_id": "section_id_1",
                
                "elements": [
//                    
                    {
                        "element_text": true,
                        "id": "title",
                        "name": "title",
                        "label": "title",
                        "required": true,
                        "field-help": {
                            "content": "(required) text to be shown on the title bar of the dialog.",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "value": "{{titleText}}"    
                    },
                    {
                        "element_text": true,
                        "id": "question",
                        "name": "question",
                        "label": "question",
                        "required": true,
                        "field-help": {
                            "content": '(required) text to be asked in the content of the dialog. Usually a question like "Are you sure you want to do this?"',
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "value": "{{questionText}}"    
                    },
                    {
                        "element_text": true,
                        "id": "yesButtonLabel",
                        "name": "yesButtonLabel",
                        "label": "yesButtonLabel",
                        "required": true,
                        "field-help": {
                            "content": "(optional) string label for the Yes Button",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "value": "{{yesText}}"    
                    },
                    {
                        "element_text": true,
                        "id": "noButtonLabel",
                        "name": "noButtonLabel",
                        "label": "noButtonLabel",
                        "required": true,
                        "field-help": {
                            "content": "(optional) string label for the No button",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "value": "{{noText}}"    
                    },
                    {
                        "element_text": true,
                        "id": "yesButtonCallback",
                        "name": "yesButtonCallback",
                        "label": "yesButtonCallback",
                        "required": true,
                        "field-help": {
                            "content": '(optional) callback function when Yes Button clicked. The yesButtonCallbackwill be called with a true/false argument - true if the user selected the "do not show again" checkbox, false otherwise.',
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "disabled": true,
                        "value": "{{yesCallback}}"    
                    },
                    {
                        "element_text": true,
                        "id": "noButtonCallback",
                        "name": "noButtonCallback",
                        "label": "noButtonCallback",
                        "required": true,
                        "field-help": {
                            "content": "(optional) callback function when No Button clicked.",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "disabled": true,
                        "value": "{{noCallback}}"    
                    },
                    {
                        "element_checkbox": true,
                        "id": "kind",
                        "label": "kind",
                        "required": false,
                        "values": [
                            {
                                "id": "checkbox_warning",
                                "name": "checkbox_warning",
                                "label": "warning",
                                "value": "enable",
                                "checked": false
                            }
                        ],
                        "field-help": {
                            "content": "(optional) string to indicate the kind of dialog box. One of the following: 'warning' (displayed with an outline); when not specified no special outline will be shown on the dialog. Use the 'warning' parameter to capture user attention for important confirmation questions.",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        }
                        
                    },
                    {
                        "element_checkbox": true,
                        "id": "xIcon",
                        "label": "xIcon",
                        "required": false,
                        "values": [
                            {
                                "id": "checkbox_xIcon",
                                "name": "checkbox_xIcon",
                                "label": "xIcon",
                                "value": "enable",
                                "checked": true
                            }
                        ],
                        "field-help": {
                            "content": "(optional) true/false to indicate if an X (close) icon should appear in the upper right corner of the dialog. If not passed in, no xIcon is shown.",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        }
                        
                    }
                    
                ]
            }
            
        ],

        "buttonsClass":"buttons_row",
        "buttons": [
            {
                "id": "generate",
                "name": "generate",
                "value": "Generate",
                "isInactive": true
            }
             
        ]
        
    };

    configurationSample.values = {
        "titleText": "Test Confirmation Dialog",
        "questionText": "Are you sure you want to do this?",
        "yesText": "Yes",
        "noText": "No",
        "yesCallback": "yesButtonCallback",
        "noCallback": "noButtonCallback",
        "yesTrigger":"yesEventTriggered",
        "noTrigger":"noEventTriggered"
    };

    return configurationSample;

});