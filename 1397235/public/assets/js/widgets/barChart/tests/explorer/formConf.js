/*
Configuration for setting up the form in demo page
*/

define([
], function () {

    var configurationSample = {};

    configurationSample.elements = {
        "title": "Bar Chart Demo",
        "form_id": "barChartDemoForm",
        "form_name": "barChartDemoForm",
        "title-help": {
            "content": "Configure bar chart options for demo",
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
                "heading_text": "Fill in options to see the bar chart ",
                "section_id": "section_id_1",
                
                "elements": [
                   {
                        "element_dropdown": true,
                        "id": "type",
                        "name": "type",
                        "label": "type",
                        "required": true,
//                        "dropdown_disabled": true,
                        "values": [ //to be deprecated, use data instead
                            
                            {
                                "label": "bar",
                                "value": "bar"
                            },
                            {
                                "label": "column",
                                "value": "column"
                                
                            },
                            {
                                "label": "stacked-bar",
                                "value": "stacked-bar"
                                //"disabled": true
                                
                            }
                        ],
                        "field-help": {
                            "content": "chart type (bar or column), default is set to bar when type is not specified.",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "error": "Please make a selection"
                    }, 
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
                        "element_text": true,
                        "id": "yAxisLabelFormat",
                        "name": "yAxisLabelFormat",
                        "label": "yAxisLabelFormat",
                        "required": false,
                        "field-help": {
                            "content": "string appended to the yAxis label",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "value": "{{YLabel}}",
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
                        "element_number": true,
                        "id": "height",
                        "name": "height",
                        "label": "height",
                        "required": false,
                        "field-help": {
                            "content": "chart height, default is set to fit inside a 400px X 300px dashlet when height is not specified",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "value": "",
                        "min_value":"10",
                        "max_value":"1000",
                        "value": "{{height}}",
                        "error": "Please enter a number between 10 and 1000"     
                    },
                    {
                        "element_number": true,
                        "id": "width",
                        "name": "width",
                        "label": "width",
                        "required": false,
                        "field-help": {
                            "content": 'chart width, default is set to fit inside a 400px X 300px dashlet when width is not specified',
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "disabled": false,
                        "value": "" ,
                        "min_value":"10",
                        "max_value":"1000",
                        "value": "{{width}}",
                        "error": "Please enter a number between 10 and 1000"   
                    },
                    {
                        "element_text": true,
                        "id": "categories",
                        "name": "categories",
                        "label": "categories",
                        "required": false,
                        "field-help": {
                            "content": "array of names used for the bars",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "value": "{{category}}",
                        "pattern": "(.*,)*(.*)" ,// (\[(\".*\",)*(\".*\")\])|(\[\])
                        "error": "Enter comma seperated value"
                    },
                    {
                        "element_text": true,
                        "id": "toolTip",
                        "name": "toolTip",
                        "label": "toolTip",
                        "required": false,
                        "field-help": {
                            "content": "tooltips displayed on hover for each bar",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "value": "{{category}}",
                        "pattern": "(.*,)*(.*)" ,// (\[(\".*\",)*(\".*\")\])|(\[\])
                        "error": "Enter comma seperated value"
                    },
                    {
                        "element_text": true,
                        "id": "data",
                        "name": "data",
                        "label": "data",
                        "required": false,
                        "field-help": {
                            "content": "array of data points for the series",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "value": "{{data}}",
                        "pattern": "(.*,)*(.*)" ,// (\[(\".*\",)*(\".*\")\])|(\[\])
                        "error": "Enter comma seperated value"
                    },
                    {
                        "element_text": true,
                        "id": "legend",
                        "name": "legend",
                        "label": "legend",
                        "required": false,
                        "field-help": {
                            "content": "legend box displaying name and color for items appearing on the chart",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "value": "",
                        "pattern": "(.*,)*(.*)" ,// (\[(\".*\",)*(\".*\")\])|(\[\])
                        "error": "Enter comma seperated value"
                    },
                    {
                        "element_text": true,
                        "id": "yAxisThreshold",
                        "name": "yAxisThreshold",
                        "label": "yAxisThreshold",
                        "required": false,
                        "field-help": {
                            "content": "array of threshold values used to draw vertical plot lines common to all bars, not supported on type:column charts",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "value": "{{YThreshold}}",
                        "pattern": "(.*,)*(.*)" ,// (\[(\".*\",)*(\".*\")\])|(\[\])
                        "error": "Enter comma seperated value"
                    },
                    {
                        "element_text": true,
                        "id": "color",
                        "name": "color",
                        "label": "color",
                        "required": false,
                        "field-help": {
                            "content": "used when all bars need to display the same color",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "value": "{{color}}",
                        "pattern": ".*" ,// (\[(\".*\",)*(\".*\")\])|(\[\])
                        "error": "Enter comma seperated value"
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
        "titleText": "Test Chart",
        "XTitle":"Xaxis",
        "YTitle":"Yaxis",
        "YLabel":"%",
        "labelSize":"3",
        "height":"500",
        "width":"800",
        "category":"big,small,medium",
        "data":"34,20,29",
        "YThreshold":"25,35",
        "color":"orange"
    };

    return configurationSample;

});