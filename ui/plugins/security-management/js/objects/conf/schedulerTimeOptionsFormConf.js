

/**

 * A configuration object with the parameters required to build
 * a form for scheduler's time options
 *
 * @module schedulerTimeOptionsFormConf
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */


define([
], function () {

    var Configuration = function(context) {

        this.getValues = function() {
            return {
                "title": context.getMessage("scheduler_time_options_overlay_title", ["{{title}}"]),
                "form_id": "scheduler-create-form-time-option",
                "form_name": "scheduler-create-form-time-option",
                "title-help": {
                    "content": context.getMessage("fw_scheduler_time_options_view_tooltip"),
                    "ua-help-identifier": "fw_scheduler_time_options_view"
                },
                "on_overlay": true,
                "sections": [
                    {
                        "section_id": "time_options_summary",
                        "elements": [
                            {
                                "element_radio": true,
                                "label": context.getMessage('scheduler_day_option'),
                                "value": "{{time-options}}",
                                "values": [
                                    {
                                        "label": context.getMessage('scheduler_day_option_allday'),
                                        "id": "time-options-allday",
                                        "name": "time-options",
                                        "value": "all-day",
                                        "checked": true
                                    },
                                    {
                                        "label": context.getMessage('scheduler_day_option_exclude'),
                                        "id": "time-options-exclude",
                                        "name": "time-options",
                                        "value": "exclude"
                                    },
                                    {
                                        "label": context.getMessage('fw_scheduler_times_ranges'),
                                        "id": "time-options-timerange",
                                        "name": "time-options",
                                        "value": "timerange"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "section_id": "time_range",
                        "elements": [
                            {
                                "element_timeWidget": true,
                                "id": "time_range_start1",
                                "name": "time_range_start1",
                                "label": context.getMessage('scheduler_start_time1'),
                                "value": "{{start-time1}}",
                                "error": context.getMessage('scheduler_error_time_invalid')
                            },
                            {
                                "element_timeWidget": true,
                                "id": "time_range_stop1",
                                "name": "time_range_stop1",
                                "label": context.getMessage('scheduler_stop_time1'),
                                "value": "{{stop-time1}}",
                                "inlineButtons":[{
                                    "id": "add_time_range_button",
                                    "class": "input_button",
                                    "name": "add_time_range_button",
                                    "value": context.getMessage('fw_scheduler_times_add_time_range')
                                }],
                                "error": context.getMessage('scheduler_error_time_invalid')
                            },
                            {
                                "element_description": true,
                                "id": "time_range_separate_line"
                            },
                            {
                                "element_timeWidget": true,
                                "id": "time_range_start2",
                                "name": "time_range_start2",
                                "label": context.getMessage('scheduler_start_time2'),
                                "value": "{{start-time2}}",
                                "class" : "hide",
                                "error": context.getMessage('scheduler_error_time_invalid')
                            },
                            {
                                "element_timeWidget": true,
                                "id": "time_range_stop2",
                                "name": "time_range_stop2",
                                "label": context.getMessage('scheduler_stop_time2'),
                                "value": "{{stop-time2}}",
                                "class" : "hide",
                                "inlineButtons":[{
                                    "id": "remove_time_range_button",
                                    "class": "input_button",
                                    "name": "remove_time_range_button",
                                    "value": context.getMessage('fw_scheduler_times_remove_time_range')
                                }],
                                "error": context.getMessage('scheduler_error_time_invalid')
                            }
                        ]
                    }
                ],
                "buttonsAlignedRight": true,
                "cancel_link": {
                    "id": "time-options-cancel",
                    "value": context.getMessage('cancel')
                },
                "buttons": [
                    {
                        "id": "time-options-save",
                        "name": "save",
                        "value": context.getMessage('ok')
                    }
                ]
            };
        };
    };
    return Configuration;
});