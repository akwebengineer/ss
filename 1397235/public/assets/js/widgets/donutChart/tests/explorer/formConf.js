/*
Configuration for setting up the form in demo page
*/

define([
], function () {

    var configurationSample = {};

    configurationSample.elements = {
        "title": "Donut Chart Demo",
        "form_id": "donutChartDemoForm", 
        "form_name": "donutChartDemoForm",
        "title-help": {
            "content": "Configure donut chart options for demo",
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
                "heading": "Instantiate bar chart with options below",
                "heading_text": "Fill in options to see the bar chart",
                "section_id": "section_id_1",
                
                "elements": [
                   {
                        "element_text": true,
                        "id": "name",
                        "name": "name",
                        "label": "name",
                        "field-help": {
                            "content": "name of the chart",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "value": "{{name}}",   
                        "pattern": ".*"
                    },
                    {
                        "element_text": true,
                        "id": "data",
                        "name": "data",
                        "label": "data",
                        "field-help": {
                            "content": "array of data points for the chart",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "value": "{{data}}",   
                        "pattern": ".*"
                    },
                    {
                        "element_text": true,
                        "id": "colors",
                        "name": "colors",
                        "label": "Colors",
                        "field-help": {
                            "content": "colors array, optional; the widget has a default colors array but this option can be used to override it and specify custom colors",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "value": "{{color}}",   
                        "pattern": ".*"
                    },
                    {
                        "element_checkbox": true,
                        "id": "legend",
                        "label": "showInLegend",
                        "required": false,
                        "values": [
                            {
                                "id": "checkbox_legend",
                                "name": "checkbox_legend",
                                "label": "",
                                "value": "enable",
                                "checked": true
                            }
                        ],
                        "field-help": {
                            "content": "(optional) string to indicate the kind of dialog box. One of the following: 'warning' (displayed with an outline); when not specified no special outline will be shown on the dialog. Use the 'warning' parameter to capture user attention for important confirmation questions.",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        }
                        
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
            }
        ]
        
    };

    configurationSample.values = {
        "name":"Threat Map",
        "data":"['Critical', 4440],['Major'   , 3000],['Info'    , 300],['Minor'   , 2000],['Warning' , 1700]",
        "color":"'#ff3333', '#ff9933', '#f9d854', '#aa4ace', '#05a4ff'"
    };

    return configurationSample;

});