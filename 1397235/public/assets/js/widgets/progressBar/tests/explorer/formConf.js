/*
Configuration for setting up the form in demo page
*/

define([
], function () {

    var configurationSample = {};

    configurationSample.elements = {
        "title": "Progress Bar Demo",
        "form_id": "progressBar",
        "form_name": "progressBar",
        "title-help": {
            "content": "Configure Progress Bar options for demo",
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
                "heading": "Instantiate Progress Bar with options below",
                "heading_text": "Fill in options to see the Progress Bar",
                "section_id": "section_id_1",
                
                "elements": [
                    {
                        "element_text": true,
                        "id": "statusText",
                        "name": "statusText",
                        "label": "statusText",
                        "field-help": {
                            "content": "define the status text. If not defined, there is default label in widget.",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "value": "{{status}}",   
                        "pattern": ".*"
                    },
                    {
                        "element_text": true,
                        "id": "statusTextAfter",
                        "name": "statusTextAfter",
                        "label": "Completion Text",
                        "field-help": {
                            "content": "define the status text to be displayed after completion",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "value": "{{statusAfter}}",   
                        "pattern": ".*"
                    },
                    {
                        "element_number": true,
                        "id": "time",
                        "name": "time",
                        "label": "Time",
                        "min_value":"1",
                        "max_value":"999999999999",
                        "placeholder": "",
                        "field-help": {
                            "content": "The total time for determinate bar to complete in milliseconds",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "value":"1500",
                        "error": "Please enter a number between 2 and 8"
                    },
                    {
                        "element_number": true,
                        "id": "timeStep",
                        "name": "timeStep",
                        "label": "Time Step",
                        "min_value":"1",
                        "max_value":"999999999",
                        "placeholder": "",
                        "field-help": {
                            "content": "Gradient of millisecond, per unit time",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "value":"300",
                        "error": "Please enter a number between 2 and 8"
                    },
                    
                    {
                        "element_radio": true,
                        "id": "radio_field",
                        "label": "Type",
                        "required": true,
                        
                        "values": [
                            {
                                "id": "determinate",
                                "name": "progressBar",
                                "label": "Determinate Progress Bar ",
                                "value": "determinate",
                                "checked": true
                                
                            },
                            {
                                "id": "indeterminate",
                                "name": "progressBar",
                                "label": "Indeterminate Progress Bar",
                                "value": "indeterminate"
                            }
                            
                        ],
                        "help": "Select the type of Progress Bar",
                        "error": "Please make a selection"
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
        "status":"Wait...",
        "statusAfter":"Done!"
    };

    return configurationSample;

});