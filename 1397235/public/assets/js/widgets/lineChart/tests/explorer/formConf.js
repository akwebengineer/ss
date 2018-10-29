/*
Configuration for setting up the form in demo page
*/
define([
], function () {

    var configurationSample = {};

    configurationSample.elements = {
        "title": "Line Chart Demo",
        "form_id": "LineChartDemo",
        "form_name": "LineChartDemo",
        "title-help": {
            "content": "Configure line chart options for demo",
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
                "heading": "Instantiate line chart with options below",
                "heading_text": "Fill in options to see the line chart",
                "section_id": "section_id_1",
                
                "elements": [
                   {
                        "element_text": true,
                        "id": "title",
                        "name": "title",
                        "label": "title",
                        "field-help": {
                            "content": "chart title",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "value": "{{titleText}}",   
                        "pattern": ".*"
                    },
                    {
                        "element_text": true,
                        "id": "xAxisTitle",
                        "name": "xAxisTitle",
                        "label": "xAxisTitle",
                        "required": false,
                        "field-help": {
                            "content": 'xAxis title',
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "value": "{{XTitle}}" ,
                        "pattern": ".*"   
                    },
                    {
                        "element_text": true,
                        "id": "yAxisTitle",
                        "name": "yAxisTitle",
                        "label": "yAxisTitle",
                        
                        "required": false,
                        "field-help": {
                            "content": "yAxis title",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "value": "{{YTitle}}",
                        "pattern": ".*"   
                    },
                    {
                        "element_number": true,
                        "id": "maxLabelSize",
                        "name": "maxLabelSize",
                        "label": "maxLabelSize",

                        "required": false,
                        "field-help": {
                            "content": "maximum number of characters, a label exceeding this size is truncated and full label is displayed only on hover",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "min_value":"0",
                        "max_value":"1000",
                        "value": "{{labelSize}}",
                        "error": "Please enter a number between 0 and 1000"   
                    },
                    {
                        "element_text": true,
                        "id": "categories",
                        "name": "categories",
                        "label": "categories",
                        "required": false,
                        "field-help": {
                            "content": "array of names used for the xAxis",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "value": "{{category}}",
                        "pattern": "(.*,)*(.*)" ,// (\[(\".*\",)*(\".*\")\])|(\[\])
                        "error": "Enter comma seperated value"
                    },
                    {
                        "element_text": true,
                        "id": "colors",
                        "name": "colors",
                        "label": "colors",
                        "required": false,
                        "field-help": {
                            "content": "array to specify custom colors and override default colors",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "value": "{{colors}}",
                        "pattern": ".*" ,// (\[(\".*\",)*(\".*\")\])|(\[\])
                        "error": "Enter comma seperated value"
                    },
                    {
                        "element_text": true,
                        "id": "lines",
                        "name": "lines",
                        "label": "lines",
                        "required": false,
                        "field-help": {
                            "content": "array of objects for each series. Must include name and data for each object",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "value": "{{lines}}",
                        "pattern": ".*" ,// (\[(\".*\",)*(\".*\")\])|(\[\])
                        "error": "Enter comma seperated value"
                    },
                    {
                        "element_radio": true,
                        "id": "legend",
                        "label": "legend",
                        "required": true,
                        
                        "values": [
                            {
                                "id": "notEnabled",
                                "name": "legend1",
                                "label": "Not Enabled",
                                "value": "notEnabled",
                                "checked": true
                                
                            },
                            {
                                "id": "enabledR",
                                "name": "legend1",
                                "label": "Enabled: Right",
                                "value": "enabledR"
                            },
                            {
                                "id": "enabledB",
                                "name": "legend1",
                                "label": "Enabled: Bottom",
                                "value": "enabledB"
                            }

                            
                        ],
                        "field-help": {
                            "content": "Shows legend for lines",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "help": "Select legend visibility",
                        "error": "Please make a selection"
                    },
                   {
                        "element_checkbox": true,
                        "id": "markers",
                        "label": "markers",
                        "required": false,
                        "values": [
                            {
                                "id": "enabled",
                                "name": "enabled",
                                "label": "enabled",
                                "value": "enabled",
                                "checked": false
                            },
                            {
                                "id": "multiple",
                                "name": "multiple",
                                "label": "multiple",
                                "value": "multiple",
                                "checked": false
                            }
                        ],
                        "field-help": {
                            "content": "Markers mark every value on the line. Multiple option enable marker of different shape for each line",
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
        "titleText": "Test Chart",
        "XTitle":"Months",
        "YTitle":"Count",
        "labelSize":"10",
        "category":"'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'",
        "colors":"'#ff3333', '#ff9933', '#f9d854', '#aa4ace', '#05a4ff'",
        "lines":"{name: 'Device 1',data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]}, {name: 'Device 2',data: [2.0, 5.0, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]}, {name: 'Device 3',data: [5.9, 6.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 2.0]}, {name: 'Device 4',data: [10, 20, 23, 12, 5, 4, 11, 16, 17, 15, 14, 5]}, {name: 'Long Device Name',data: [7, 7, 7, 7, 17, 7, 7, 7, 14.3, 9.0, 3.9, 2.0]}, {name: 'Device 6',data: [5,5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5]}, {name: 'Device 7',data: [2, 3, 3.9, 3, 3, 3, 3, 3, 3, 3, 3, 3]}, {name: 'Device 8',data: [12, 12, 14, 14, 14, 16, 16, 16, 16, 18, 18, 18]}, {name: 'Device 9',data: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10]}, {name: 'Device 10',data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]}"
    };

    return configurationSample;

});