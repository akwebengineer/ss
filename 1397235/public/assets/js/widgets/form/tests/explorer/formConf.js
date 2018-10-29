/*
Configuration for setting up the form in demo page
*/

define([
], function () {

    var configuration = {};

    configuration.elements = {
        "title": "Form Demo",
        "form_id": "formDemo",
        "form_name": "formDemo",
        "title-help": {
            "content": "Configure form options for demo",
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
                "heading": "Instantiate form with basic configuration",
                "section_id": "section_id_0",
                "progressive_disclosure": "expanded",
                
                "elements": [
                   {
                        "element_text": true,
                        "id": "form_title",
                        "name": "form_title",
                        "label": "form_title",
                        "field-help": {
                            "content": "form title",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "value": "Sample Form",   
                        "pattern": ".*"
                    },
                    {
                        "element_text": true,
                        "id": "form_id",
                        "name": "form_id",
                        "label": "form_id",
                        "field-help": {
                            "content": "unique id for form, to be used internally",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "value": "sampleForm",   
                        "pattern": ".*"
                    },
                    {
                        "element_text": true,
                        "id": "form_name",
                        "name": "form_name",
                        "label": "form_name",
                        "field-help": {
                            "content": "Name for form, to be used internally",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "value": "sampleForm",   
                        "pattern": ".*"
                    },
                    {
                        "element_text": true,
                        "id": "form_help",
                        "name": "form_help",
                        "label": "title help content",
                        "field-help": {
                            "content": "adds a tooltip text next to the title of the form",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "value": "sample form generated dynamically",   
                        "pattern": ".*"
                    },
                    {
                        "element_text": true,
                        "id": "form_error_div_id",
                        "name": "form_error_div_id",
                        "label": "error_div_id",
                        "field-help": {
                            "content": "ID of the error div that is generated in case of error on form submit",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "value": "eDiv",   
                        "pattern": ".*"
                    },
                    {
                        "element_text": true,
                        "id": "form_error_div_message",
                        "name": "form_error_div_message",
                        "label": "error_div_message",
                        "field-help": {
                            "content": "Message of the error div that is generated in case of error on form submit",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "value": "One or more fields have errors. Update the fields highlighted below",   
                        "pattern": ".*"
                    },
                    {
                        "element_text": true,
                        "id": "form_error_div_link",
                        "name": "form_error_div_link",
                        "label": "error_div_link",
                        "field-help": {
                            "content": "link for more info in the error div that is generated in case of error on form submit",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "value": "http://www.juniper.net/",   
                        "pattern": ".*"
                    },
                    {
                        "element_text": true,
                        "id": "form_error_div_link_text",
                        "name": "form_error_div_link_text",
                        "label": "error_div_link_text",
                        "field-help": {
                            "content": "link for more info in the error div that is generated in case of error on form submit",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "value": "Click for help",   
                        "pattern": ".*"
                    },
                    {
                        "element_text": true,
                        "id": "form_error_timeout",
                        "name": "form_error_timeout",
                        "label": "error_timeout",
                        "field-help": {
                            "content": "time in milliseconds that a validation will take before is triggered",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "value": "1000",   
                        "pattern": ".*"
                    },
                    {
                        "element_text": true,
                        "id": "form_valid_timeout",
                        "name": "form_valid_timeout",
                        "label": "valid_timeout",
                        "field-help": {
                            "content": "time in milliseconds that a validation will take before is triggered",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "value": "5000",   
                        "pattern": ".*"
                    }

                ]
            },
            {
                "heading": "Add form parts",
                "heading_text": "Add section, footer, buttons and cancel link to form",
                "section_id": "section_id_2",
                "progressive_disclosure": "expanded",
                "elements": [
                   {
                        "element_checkbox": true,
                        "id": "form_footer",
                        "label": "Add footer",
                        "required": false,
                        "values": [
                            {
                                "id": "form_footer_checkbox",
                                "name": "form_footer_checkbox",
                                "label": "",
                                "value": "form_footer_checkbox",
                                "checked": false
                            }
                        ],
                        "field-help": {
                            "content": " The footer section is composed by a text, url and id that will be presented at the end of the form. Footer of the form is optional, if not present it will be absent from the form.",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        }
                        
                    },
                    {
                        "element_checkbox": true,
                        "id": "form_cancel_link",
                        "label": "Add cancel link",
                        "required": false,
                        "values": [
                            {
                                "id": "form_cancel_link_checkbox",
                                "name": "form_cancel_link_checkbox",
                                "label": "",
                                "value": "form_cancel_link_checkbox",
                                "checked": false
                            }
                        ],
                        "field-help": {
                            "content": "Adds a cancel link next to the buttons.",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        }
                        
                    },
                    {
                        "element_dropdown": true,
                        "id": "form_button",
                        "name": "form_button",
                        "label": "Add button",
                        "data": [ 
                            
                            {
                                "text": "Buttons aligned to the right",
                                "id": "button_right"
                            },
                            {
                                "text": "Buttons aligned to the left",
                                "id": "button_left"
                                
                            },
                            {
                                "text": "Primary (active) button",
                                "id": "button_active"   
                            },
                            {
                                "text": "Secondary (inactive) button",
                                "id": "button_inactive"
                                
                            }
                        ],
                        "field-help": {
                            "content": "The buttons array represent the set of buttons that will be showed at the end of the form.",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        }
                    },
                    {
                        "element_dropdown": true,
                        "id": "form_section",
                        "name": "form_section",
                        "label": "Add section",
                        "class":"sectionCopy",
                        "required": true,
                        "initValue": "{{dropDown}}",
                        "data": [ 
                            {
                                "text": "Standard section",
                                "id": "section_standard"
                            },
                            {
                                "text": "Toggle section",
                                "id": "section_toggle"
                                
                            },
                            {
                                "text": "Collapsible section",
                                "id": "section_collapsible"
                                //"disabled": true
                                
                            },
                            {
                                "text": "Custom section",
                                "id": "section_custom",
                                "visibility": "element_type"
                                
                            }
                        ],
                        "field-help": {
                            "content": "A form is composed of multiple sections. Sections are logical and visual grouping of form elements",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        }
                    },
                    {
                        "element_dropdown": true,
                        "id": "element_type",
                        "name": "element_type",
                        "label": "element_type",
                        "hidden": true,
                        "class": "elementCopy",
                        "values": [       
                            {
                                "label": "element_text",
                                "value": "element_text"
                            },
                            {
                                "label": "element_password",
                                "value": "element_password"              
                            },
                            {
                                "label": "element_multiple_error",
                                "value": "element_multiple_error"      
                            },
                            {
                                "label": "element_email",
                                "value": "element_email"        
                            },
                            {
                                "label": "element_url",
                                "value": "element_url"        
                            },
                            {
                                "label": "element_string",
                                "value": "element_string"        
                            },
                            {
                                "label": "element_number",
                                "value": "element_number" 
                            },
                            {
                                "label": "element_alphanumeric",
                                "value": "element_alphanumeric"        
                            },
                            {
                                "label": "element_hexadecimal",
                                "value": "element_hexadecimal"        
                            },
                            {
                                "label": "element_color",
                                "value": "element_color"        
                            },
                            {
                                "label": "element_lowercase",
                                "value": "element_lowercase"        
                            },
                            {
                                "label": "element_uppercase",
                                "value": "element_uppercase"        
                            },
                            {
                                "label": "element_integer",
                                "value": "element_integer"        
                            },
                            {
                                "label": "element_float",
                                "value": "element_float"        
                            },
                            {
                                "label": "element_divisible",
                                "value": "element_divisible"     
                            },
                            {
                                "label": "element_length",
                                "value": "element_length"       
                            },
                            {
                                "label": "element_date",
                                "value": "element_date"        
                            },
                            {
                                "label": "element_afterdate",
                                "value": "element_afterdate"      
                            },
                            {
                                "label": "element_beforedate",
                                "value": "element_beforedate"   
                            },
                            {
                                "label": "element_time",
                                "value": "element_time"        
                            },
                            {
                                "label": "element_inarray",
                                "value": "element_inarray"        
                            },
                            {
                                "label": "element_creditcard",
                                "value": "element_creditcard"        
                            },
                            {
                                "label": "element_ip",
                                "value": "element_ip",   
                            },
                            {
                                "label": "element_ip_v4Orv6",
                                "value": "element_ip_v4Orv6"        
                            },
                            {
                                "label": "element_textarea",
                                "value": "element_textarea"       
                            },
                            {
                                "label": "element_description",
                                "value": "element_description"        
                            },
                            {
                                "label": "element_description_encode",
                                "value": "element_description_encode"        
                            },
                            {
                                "label": "element_checkbox",
                                "value": "element_checkbox"        
                            },
                            {
                                "label": "element_radio",
                                "value": "element_radio"        
                            },
                            {
                                "label": "element_dropdown",
                                "value": "element_dropdown"        
                            },
                            {
                                "label": "element_file",
                                "value": "element_file",   
                            },
                            {
                                "label": "element_fingerprint",
                                "value": "element_fingerprint"        
                            }

                        ],
                        "field-help": {
                            "content": "Type of element.",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "error": "Please make a selection"
                    }
                ]
            }
        ],

        "buttonsClass":"buttons_row",
        "buttons": [
            // {
            //     "id": "add_section",
            //     "name": "add_section",
            //     "value": "Add section",
            // },
            {
                "id": "add_element",
                "name": "add_element",
                "value": "Add element",
            },
            {
                "id": "generate",
                "name": "generate",
                "value": "Generate",
                "isInactive": true
            }
        ]
        
    };
    configuration.footer =[
        {
            "text":"By setting the root password I accept the terms of the ",
            "url":"License Agreement",
            "href":"https://www.google.com/",
            "id":"login_agreement"
        },
        {
            "text":"Another sample footer "
        }
    ];
    configuration.cancel = {
        "id": "cancel_form",
        "value": "Cancel"
    };
    configuration.button1=[
        {
            "id": "sample_button1",
            "name": "sample_button1",
            "value": "Sample Button"
        },
        {
            "id": "sample_button2",
            "name": "sample_button2",
            "value": "Aother Sample"
        },
        {
            "id": "sample_button3",
            "name": "sample_button3",
            "value": "Yet Another"
        }
    ];
    configuration.button2=[
        {
            "id": "primary_button",
            "name": "primary_button",
            "value": "Primary Button"
        },
        {
            "id": "secondary_button",
            "name": "secondary_button",
            "value": "Seciondary Sample",
            "isInactive": true
        }
    ];

    configuration.section=[
        {
            "heading": "Standard Section",
            "heading_text": "This section is a standard section in a form. It contains 2 sample elements",
            "section_id": "section_standard",
            "elements": [
                {
                    "element_text": true,
                    "id": "standard_text",
                    "name": "stadard_text",
                    "label": "Text Input box",
                    "required": false,
                    "value": "",
                    "pattern": ".*"   
                },
                {
                    "element_number": true,
                    "id": "standard_number",
                    "name": "standard_number",
                    "label": "Number Input box",
                    "required": false,
                    "min_value":"0",
                    "max_value":"1000",
                    "value": "",
                    "error": "Please enter a number between 0 and 1000"   
                }          
            ]
        },
        {
            "heading": "Toggle Section",
            "heading_text": "This section is a toggle section in a form. It will render with a checkbox in front of it which controls if the section elements are shown or not. It can have a default show or hide which decides how the section will be rendered the first time form is rendered. It contains 2 sample elements",
            "section_id": "section_toggle",
            "toggle_section":{
                "label": "Select to show the form elements of the toggle section",
                "status": "hide" 
            },
            "elements": [
                {
                    "element_text": true,
                    "id": "toggle_text",
                    "name": "toggle_text",
                    "label": "Text Input box",
                    "required": false,
                    "value": "",
                    "pattern": ".*"   
                },
                {
                    "element_number": true,
                    "id": "toggle_number",
                    "name": "toggle_number",
                    "label": "Number Input box",
                    "required": false,
                    "min_value":"0",
                    "max_value":"1000",
                    "value": "",
                    "error": "Please enter a number between 0 and 1000"   
                }          
            ]
        },
        {
          "heading": "Collapsible Section",
            "heading_text": "This section is a collapsible section in a form. It has an icon next to the title of the section (heading) that allows to close or open the section. It can be set to collapsed or expanded by default which will determine how it is rendered the first time form is rendered. It contains 2 sample elements",
            "section_id": "section_collapsible",
            "progressive_disclosure": "collapsed",
            "elements": [
                {
                    "element_text": true,
                    "id": "collapsible_text",
                    "name": "collapsible_text",
                    "label": "Text Input box",
                    "required": false,
                    "value": "",
                    "pattern": ".*"   
                },
                {
                    "element_number": true,
                    "id": "collapsible_number",
                    "name": "collapsible_number",
                    "label": "Number Input box",
                    "required": false,
                    "min_value":"0",
                    "max_value":"1000",
                    "value": "",
                    "error": "Please enter a number between 0 and 1000"   
                }          
            ]
        },
        {
          "heading": "Custom Section",
            "heading_text": "This section is a custom section in a form. The elements that you have added will appear here",
            "section_id": "section_custom",
            "elements": [
                        
            ]
        },
    ];
    configuration.element = {
        "element_text":{
            "element_text": true,
            "id": "element_text",
            "name": "element_text",
            "label": "Text Input box",
            "value": "",   
            "pattern": ".*"
        },
        "element_number":{
            "element_number": true,
            "id": "element_number",
            "name": "element_number",
            "label": "Number Input box",
            "min_value":"0",
            "max_value":"10",
            "value": "",
            "error": "Please enter a number between 0 and 10"   
        },
        "element_password":{
            "element_password": true,
            "id": "element_password",
            "name": "element_password",
            "label": "Password box",
            "placeholder": "Sp0g-Sp0g",
            "pattern-error": [
                {
                    "pattern": "hasmixedcasesymbol",
                    "error": "A combination of mixed case letters and one symbol is required."
                },
                {
                    "pattern": "hasnumber",
                    "error": "At least one number is required."
                }
            ],
            "error": true,
            "help": "Must be combination of mixed case letters, numbers, and symbols."
        },
        "element_multiple_error":{
            "element_multiple_error": true,
            "id": "element_multiple_error",
            "name": "element_multiple_error",
            "label": "Multiple error box",
            "pattern-error": [
                {
                    "pattern": "validtext",
                    "error": "This field is required."
                },
                {
                    "pattern": "length",
                    "min_length":"1",
                    "max_length":"64",
                    "error": "Must not exceed 64 characters."
                },
                {
                    "pattern": "hasalphanumericdashunderscore",
                    "error": "Only alphanumeric characters, dashes and underscores allowed."
                }
            ],
                "error": true,
                "notshowvalid": true,
                "help":"Any combination of alphabetic characters, numbers, dashes, and underscores. No other special characters are allowed. 64 characters max.",
        },
         "element_email":{
            "element_email": true,
            "id": "element_email",
            "name": "element_email",
            "label": "Email box",
            "value": ""
        },
        "element_url":{
            "element_url": true,
            "id": "element_url",
            "name": "element_url",
            "label": "Url Box",
            "placeholder": "http://www.juniper.net",
            "error": "Please enter a valid URL",
            "value": ""
        },
        "element_string":{
            "element_string": true,
            "id": "element_string",
            "name": "element_string",
            "label": "String Box",
            "error": "Please enter a valid string that contains only letters (a-zA-Z)",
        },
        "element_alphanumeric":{
            "element_alphanumeric": true,
            "id": "element_alphanumeric",
            "name": "element_alphanumeric",
            "label": "Alphanumeric box",
            "error": "Please enter a string that contains only letters and numbers"
        },
        "element_hexadecimal":{
            "element_hexadecimal": true,
            "id": "element_hexadecimal",
            "name": "element_hexadecimal",
            "label": "Element hexadecimal",
            "error": "Please enter a valid hexadecimal number"
        },
        "element_color":{
            "element_color": true,
            "id": "element_color",
            "name": "element_color",
            "label": "Color box",
            "error": "Please enter a valid hexadecimal color"
        },
        "element_lowercase":{
            "element_lowercase": true,
            "id": "element_lowercase",
            "name": "element_lowercase",
            "label": "Lowercase Text box",
            "error": "Please enter a valid string in lowercase"
        },
        "element_uppercase": {
            "element_uppercase": true,
            "id": "element_uppercase",
            "name": "element_uppercase",
            "label": "Upercase Text box",
            "error": "Please enter a valid string in uppercase"
        },
        "element_integer":{
            "element_integer": true,
            "id": "element_integer",
            "name": "element_integer",
            "label": "Integer text box",
            "error": "Please enter a valid integer"
        },
        "element_float":{
            "element_float": true,
            "id": "element_float",
            "name": "element_float",
            "label": "Float text box",
            "error": "Please enter a valid float"
        },
        "element_divisible":{
            "element_divisible": true,
            "divisible_by":"5",
            "id": "element_divisible",
            "name": "element_divisible",
            "label": "Divisible text box",
            "error": "Please enter a number that is divisible by 5"
        },
        "element_length":{
            "element_length": true,
            "min_length":"2",
            "max_length":"5",
            "id": "element_length",
            "name": "element_length",
            "label": "Length text box",
            "error": "Please enter a string that is greater than or equal to 2 but less than or equal to 5"
        },
        "element_date":{
            "element_date": true,
            "id": "element_date",
            "name": "element_date",
            "label": "Date box",
            "error": "Please enter a valid date"
        },
        "element_afterdate":{
            "element_afterdate": true,
            "after_date":"05/28/2014",
            "id": "element_afterdate",
            "name": "element_afterdate",
            "label": "Afterdate box",
            "error": "Please enter a date after May 28, 2014"
        },
        "element_beforedate":{
            "element_beforedate": true,
            "before_date":"06/20/2014",
            "id": "element_beforedate",
            "name": "element_beforedate",
            "label": "Beforedate box",
            "error": "Please enter a date before June 20, 2014"
        },
        "element_time":{
            "element_time": true,
            "id": "element_time",
            "name": "element_time",
            "label": "Time box",
            "error": "Please enter a valid time"
        },
        "element_inarray":{
            "element_inarray": true,
            "id": "element_inarray",
            "name": "element_inarray",
            "label": "Inarray box",
            "values": [
                {"value": "4"},
                {"value": "5"},
                {"value": "6"}
            ],
            "error": "Please enter one of the allowed values: 4, 5 or 6"
        },
        "element_ip": {
            "element_ip": true,
            "ip_version": "4",
            "id": "element_ip",
            "name": "element_ip",
            "label": "IP box",
            "error": "Please enter a valid IP address version 4"
        },
        "element_ip_v4Orv6":{
            "element_ip_v4Orv6": true,
            "id": "element_ip_v4Orv6",
            "name": "element_ip_v4Orv6",
            "label": "IP v4 or v6 box",
            "error": "Please enter a valid IP either version 4 or version 6"
        },
        "element_textarea":{
            "element_textarea": true,
            "id": "element_area",
            "name": "element_area",
            "label": "Textarea",
            "pattern": ".*"
        },
        "element_description":{
            "element_description": true,
            "id":"element_description",
            "label": "Description",
            "value": "Description"
        },
        "element_description_encode":{
            "element_description_encode": true,
            "label": "Description Encode",
            "value": "Description <b>Encode</b>",
            "id":"element_description_encode"
        },
        "element_checkbox":{
            "element_checkbox": true,
            "id": "element_checkbox",
            "label": "checkbox",
            "required": false,
            "values": [
                {
                    "id": "checkbox_1",
                    "name": "checkbox_1",
                    "label": "option1",
                    "value": "option1",
                    "checked": false
                },
                {
                    "id": "checkbox_2",
                    "name": "checkbox_2",
                    "label": "option2",
                    "value": "option2",
                    "checked": false
                }
            ],
        },
        "element_radio":{
            "element_radio": true,
            "id": "element_radio",
            "label": "Radio buttons",                      
            "values": [
                {
                    "id": "radio1",
                    "name": "ele_radio",
                    "label": "option 1",
                    "value": "opt1",
                    "checked": true
                                
                },
                {
                    "id": "radio2",
                    "name": "ele_radio",
                    "label": "option 2",
                    "value": "opt2"
                }            
            ] 
        },
        "element_dropdown":{
            "element_dropdown": true,
            "id": "element_dropdown",
            "name": "element_dropdown",
            "label": "Dropdown",
            "data": [ 
                {
                    "text": "Dropdown Option 1",
                    "id": "DD_op1"
                },
                {
                    "text": "Dropdown Option 2",
                    "id": "DD_op2"
                },
                {
                    "text": "Dropdown Option 3",
                    "id": "DD_op3"
                },
                {
                    "text": "Dropdown Option 4",
                    "id": "DD_op4"
                }
            ],
        },
        "element_file":{
            "element_file": true,
            "id": "element_file",
            "name": "element_file",
            "label": "File Upload",
            "fileupload_button_label": "Browse",
            "error": "Please select a valid file"
        },
        "element_fingerprint":{
            "element_fingerprint": true,
            "id": "element_fingerprint",
            "name": "element_fingerprint",
            "label": "Fingerprint box",
            "error": "Please enter a valid fingerprint"
        }              
    };
    configuration.values = {
        "dropDown": {
            "text": "Standard section",
            "id": "section_standard"
        }
    };

    return configuration;

});