/*
Configuration for setting up the form in demo page
*/

define([
], function () {

    var configurationSample = {};

    configurationSample.elements = {
        "title": "Time Series Chart Demo",
        "form_id": "timeSeriesChartDemo",
        "form_name": "timeSeriesChartDemo",
        "title-help": {
            "content": "Configure time Series chart options for demo",
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
                "heading": "Instantiate time series chart with options below",
                "heading_text": "Fill in options to see the time series chart",
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
                        "id": "yAxisThresholdVal",
                        "name": "yAxisThresholdVal",
                        "label": "yAxisThreshold:Value",
                        "required": false,
                        "field-help": {
                            "content": "value for threshold",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "value": "{{YThVal}}",
                        "pattern": ".*"   
                    },
                    {
                        "element_text": true,
                        "id": "yAxisThresholdCol",
                        "name": "yAxisThresholdCol",
                        "label": "yAxisThreshold:Color",
                        "required": false,
                        "field-help": {
                            "content": "color to be used for threshold line",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "value": "{{YThCol}}",
                        "pattern": ".*"   
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
                        "pattern": ".*" ,// (\[(\".*\",)*(\".*\")\])|(\[\])
                        "error": "Enter comma seperated value"
                    },
                    {
                        "element_checkbox": true,
                        "id": "trSelector",
                        "label": "timeRangeSelectorEnabled",
                        "required": false,
                        "values": [
                            {
                                "id": "enabled",
                                "name": "enabled",
                                "label": "enabled",
                                "value": "enabled",
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
                        "id": "ptRanges",
                        "label": "presetTimeRangesEnabled",
                        "required": false,
                        "values": [
                            {
                                "id": "enabled",
                                "name": "enabled",
                                "label": "enabled",
                                "value": "enabled",
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
        "YTitle":"Yaxis",
        "YThVal":"900",
        "YThCol":"#ff0000",
        "data" : "{name: 'GOOG',color: '#007777',points:[[1147651200000,376.2],[1147737600000,371.3]]}, {name: 'MSFT', color: '#0000ff',points: [[1147651200000,23.15],[1147737600000,23.01]] }"
    };

    return configurationSample;

});