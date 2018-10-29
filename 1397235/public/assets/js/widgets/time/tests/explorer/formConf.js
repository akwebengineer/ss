/*
Configuration for setting up the form in demo page
*/

define([
], function () {

    var configurationSample = {};

    configurationSample.elements = {
        "title": "Time Demo",
        "form_id": "timeDemo",
        "form_name": "timeDemo",
        "title-help": {
            "content": "There are no configurable options for this widget",
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
                // "heading": "",
                // "heading_text": "",
                "section_id": "section_id_1",
                
                "elements": [
                   
                    //add elements of form
                    
                ]
            }
            
        ],

        "buttonsClass":"buttons_row",
        "buttons": [
             // add buttons
             {
                "id": "generate",
                "name": "generate",
                "value": "Generate",
                "isInactive": true
            },
            {
                "id": "selected",
                "name": "selected",
                "value": "Get Time",
                "isInactive": true
            }
        ]
        
    };

    configurationSample.values = {
        //any default values used in elements
    };

    return configurationSample;

});