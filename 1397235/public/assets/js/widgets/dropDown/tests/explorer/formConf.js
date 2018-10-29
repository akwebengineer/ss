/*
Configuration for setting up the form in demo page
*/

define([
], function () {

    var configurationSample = {};

    configurationSample.elements = {
        "title": "Drop Down Demo",
        "form_id": "dropDownDemo",
        "form_name": "dropDownDemo",
        "title-help": {
            "content": "Configure drop down options for demo",
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
                "heading": "Instantiate drop down with options below",
                "heading_text": "Fill in options to see the drop down",
                "section_id": "section_id_1",
                
                "elements": [
                    {
                        "element_text": true,
                        "id": "placeholder",
                        "name": "placeholder",
                        "label": "placeholder",
                        "field-help": {
                            "content": "string that defines a short hint for the user",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "value": "select an option",   
                        "pattern": ".*"
                    },
                    {
                        "element_dropdown": true,
                        "id": "data",
                        "name": "data",
                        "label": "data",
                        "values": [ //to be deprecated, use data instead
                            
                            {
                                "label": "Full Data",
                                "value": "full"
                            },
                            {
                                "label": "Simple Data",
                                "value": "simple"
                                
                            },
                            {
                                "label": "Short Data",
                                "value": "short"                                
                            },
                            {
                                "label": "Remote Data",
                                "value": "remote"                                
                            }
                        ],
                        "field-help": {
                            "content": "chart type (bar or column), default is set to bar when type is not specified.",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "error": "Please make a selection"
                    }, 
                    {
                        "element_checkbox": true,
                        "id": "init",
                        "label": "set initValue",
                        "required": false,
                        "values": [
                            {
                                "id": "set_init",
                                "name": "set_init",
                                "label": "",
                                "value": "set_init",
                                "checked": false
                            }
                        ],
                        "field-help": {
                            "content": "boolean, true allows to show a checkbox next to the dropdown option",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        }
                        
                    },
                    {
                        "element_checkbox": true,
                        "id": "showCheckboxes",
                        "label": "showCheckboxes",
                        "required": false,
                        "values": [
                            {
                                "id": "enabled_checkbox",
                                "name": "enabled_checkbox",
                                "label": "",
                                "value": "enabled_checkbox",
                                "checked": false
                            }
                        ],
                        "field-help": {
                            "content": "boolean, true allows to show a checkbox next to the dropdown option",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        }
                        
                    },
                    {
                        "element_checkbox": true,
                        "id": "allowClearSelection",
                        "label": "allowClearSelection",
                        "required": false,
                        "values": [
                            {
                                "id": "enabled_clear",
                                "name": "enabled_clear",
                                "label": "",
                                "value": "enabled_clear",
                                "checked": false
                            }
                        ],
                        "field-help": {
                            "content": "Markers mark every value on the line. Multiple option enable marker of different shape for each line",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        }
                        
                    },
                    
                    {
                        "element_checkbox": true,
                        "id": "matcher",
                        "label": "setMatcher",
                        "required": false,
                        "values": [
                            {
                                "id": "setMatcher",
                                "name": "setMatcher",
                                "label": "",
                                "value": "setMatcher",
                                "checked": false
                            }
                        ],
                        "field-help": {
                            "content": "javascript function that defines a specific filter functionality",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        }
                        
                    },
                    {
                        "element_checkbox": true,
                        "id": "change",
                        "label": "onChange",
                        "required": false,
                        "values": [
                            {
                                "id": "onChange",
                                "name": "onChange",
                                "label": "",
                                "value": "onChange",
                                "checked": false
                            }
                        ],
                        "field-help": {
                            "content": "function called when the value selection of the dropdown is changed",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        }
                        
                    },
                    {
                        "element_checkbox": true,
                        "id": "search",
                        "label": "enableSearch",
                        "required": false,
                        "values": [
                            {
                                "id": "enableSearch",
                                "name": "enableSearch",
                                "label": "",
                                "value": "enableSearch",
                                "checked": false
                            }
                        ],
                        "field-help": {
                            "content": "select if search should be enabled for the values in the dropdown, false otherwise",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        }
                        
                    },
                    {
                        "element_checkbox": true,
                        "id": "template",
                        "label": "template",
                        "required": false,
                        "values": [
                            {
                                "id": "templateResult",
                                "name": "templateCheckbox1",
                                "label": "templateResult",
                                "value": "templateResult",
                                "checked": false
                            },
                            {
                                "id": "templateSelection",
                                "name": "templateCheckbox2",
                                "label": "templateSelection",
                                "value": "templateSelection",
                                "checked": false
                            }
                        ],
                        "field-help": {
                            "content": "select if search should be enabled for the values in the dropdown, false otherwise",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        }
                        
                    }
                ]
            },
            {
                "heading": "Multiple Selection",
                "heading_text": "The multipleSelection parameter defines an object that allows to add multiple selection to a simple dropdown.",
                "section_id": "section_id_2",
                "section_class": "section_class",
                //"progressive_disclosure": "collapsed",
                "toggle_section":{
                    "label": "Select to show the form elements of the multiple validation section",
                    "status": "hide" //two possible values: show or hide
//                    "checked": true
                },
                "elements": [
                {
                        "element_checkbox": true,
                        "id": "MSallowClearSelection",
                        "label": "allowClearSelection",
                        "required": false,
                        "values": [
                            {
                                "id": "enabled_clearMS",
                                "name": "enabled_clearMS",
                                "label": "",
                                "value": "enabled_clearMS",
                                "checked": false
                            }
                        ],
                        "field-help": {
                            "content": "allows to remove all elements from the list of selected options when it is set to true",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        }
                        
                    },
                    {
                        "element_checkbox": true,
                        "id": "MScreateTags",
                        "label": "createTags",
                        "required": false,
                        "values": [
                            {
                                "id": "enabled_tagsMS",
                                "name": "enabled_tagsMS",
                                "label": "",
                                "value": "enabled_tagsMS",
                                "checked": false
                            }
                        ],
                        "field-help": {
                            "content": "allows user to create new entries to the list of available options.",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        }
                        
                    },
                    {
                        "element_number": true,
                        "id": "MSmaximumSelectionLength",
                        "name": "MSmaximumSelectionLength",
                        "label": "maximumSelectionLength",
                        "required": false,
                        "field-help": {
                            "content": "restricts the maximum number of options selected",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "min_value":"0",
                        "max_value":"1000",
                        "value": "",
                        "error": "Please enter a number between 0 and 1000"   
                    },
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
            }
        ]
        
    };

    configurationSample.values = {
        //any default values used in elements
    };

    return configurationSample;

});