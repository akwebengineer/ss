/*
Configuration for setting up the form in demo page
*/

define([
], function () {

    var configurationSample = {};

    configurationSample.elements = {
        "title": "Date Picker Demo",
        "form_id": "datePickerDemo",
        "form_name": "datePickerDemo",
        "title-help": {
            "content": "Configure date picker options for demo",
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
                "heading": "Instantiate date picker with options below",
                "heading_text": "Fill in options to see the date picker",
                "section_id": "section_id_1",
                
                "elements": [
                   {
                        "element_text": true,
                        "id": "format",
                        "required": false,
                        "name": "format",
                        "label":"format",
                        "field-help": {
                            "content": "format for date",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "value": "mm/dd/yyyy",   
                        "pattern": ".*"
                    },
                    {
                        "element_number": true,
                        "id": "month1",
                        "required": false,
                        "name": "month1",
                        "label":"setDate",
                        "class":"date",
                        "min_value":"1",
                        "max_value":"12",
                        "value": "",
                        "field-help": {
                            "content": "Enter default date to show on widget",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "placeholder": "mm"
                    },{
                        "element_number": true,
                        "id": "day1",
                        "required": false,
                        "name": "day1",
                        "class":"date",
                        "min_value":"1",
                        "max_value":"31",
                        "placeholder": "dd",   
                        "value": ""
                    },{
                        "element_number": true,
                        "id": "year1",
                        "required": false,
                        "name": "year1",
                        "class":"date",
                        "min_value":"1",
                        "max_value":"10000",
                        "placeholder": "yyyy",   
                        "value": ""
                    },
                    {
                        "element_number": true,
                        "id": "month2",
                        "required": false,
                        "name": "month2",
                        "label":"minDate",
                        "class":"date",
                        "min_value":"1",
                        "max_value":"12",
                        "placeholder": "mm", 
                        "field-help": {
                            "content": "set minimum date selectable",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },  
                        "value": ""
                    },{
                        "element_number": true,
                        "id": "day2",
                        "required": false,
                        "name": "day2",
                        "class":"date",
                        "min_value":"1",
                        "max_value":"31",
                        "placeholder": "dd",   
                        "value": ""
                    },{
                        "element_number": true,
                        "id": "year2",
                        "required": false,
                        "name": "year2",
                        "class":"date",
                        "min_value":"1",
                        "max_value":"10000",
                        "placeholder": "yyyy",   
                        "value": ""
                    },
                    {
                        "element_number": true,
                        "id": "month3",
                        "required": false,
                        "name": "month3",
                        "label":"maxDate",
                        "min_value":"1",
                        "max_value":"12",
                        "class":"date",
                        "field-help": {
                            "content": "set maximum date selectable",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "placeholder": "mm",   
                        "value": ""
                    },{
                        "element_number": true,
                        "id": "day3",
                        "required": false,
                        "name": "day3",
                        "class":"date",
                        "min_value":"1",
                        "max_value":"31",
                        
                        "placeholder": "dd",   
                        "value": ""
                    },{
                        "element_number": true,
                        "id": "year3",
                        "required": false,
                        "name": "year3",
                        "class":"date",
                        "min_value":"0",
                        "max_value":"10000",
                        "placeholder": "yyyy",   
                        "value": ""
                    }
                    
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
                "id": "getDate",
                "name": "getDate",
                "value": "Get date",
                "isInactive": true
            }
        ]
        
    };

    configurationSample.values = {
        //any default values used in elements
    };

    return configurationSample;

});