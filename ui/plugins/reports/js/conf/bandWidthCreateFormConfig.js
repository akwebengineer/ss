/**
 * A BandWidth  Form Config to render the  Bandwidth form 
 *
 * @module BandWidthFormConfig
 * @author Aslam a <aslama@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([],
    function() {
        var Configuration = function(context) {
            this.getValues = function() {
                return {
                    "heading": context.getMessage("report_def_form_section_content"),
                    "section_id": "appended_section_id_1",
                    "elements": [
                    {
                        "element_number": true,
                        "id": "bandwidth_count",
                        "name": "bandwidth_count",
                        "label": context.getMessage('report_bandwidth_top'),
                        "min_value" : 1,
                        "max_value":"20",
                        "value": "10",
                        "error": context.getMessage('report_bandwidth_top_error_msg'),
                        "required": true,
                        "field-help": {
                            "content": context.getMessage('report_bandwidth_top_field_help'),
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        }
                    },{
                        "element_dropdown": true,
                        "id": "bandwidth_last",
                        "name": "bandwidth_last",
                        "label": context.getMessage('report_bandwidth_last'),
                        "values": [
                            {
                                "label": context.getMessage("reports_timespan_3_hours"),
                                "value": 3
                            },
                            {
                                "label": context.getMessage("reports_timespan_6_hours"),
                                "value": 6
                            },
                            {
                                "label": context.getMessage("reports_timespan_12_hours"),
                                "value": 12
                            },
                            {
                                "label": context.getMessage("reports_timespan_24_hours"),
                                "value": 24
                            }
                        ],
                        "required": true,
                        "field-help": {
                            "content": context.getMessage('report_bandwidth_last_field_help'),
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        }
                    },

                ]
                };
            };
        };

        return Configuration;
    }
);
