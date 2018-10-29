

/**

 * A configuration object with the parameters required to build 
 * a form for scheduler
 *
 * @module schedulerFormConfiguration
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */


define(["../views/schedulerUtility.js"], function (SchedulerUtility) {
    var DATE_FORMAT = "MM/DD/YYYY";
    var DESCRIPTION_MAX_LENGTH = 900;

    var Configuration = function(context) {

        var afterDate = SchedulerUtility.getAfterDate();;

        this.getValues = function() {
            return {
                "title": context.getMessage('scheduler_overlay_title', ["{{title}}"]),
                "form_id": "scheduler-create-form",
                "form_name": "scheduler-create-form",
                "title-help": {
                    "content": context.getMessage("fw_scheduler_create_view_tooltip"),
                    "ua-help-text": context.getMessage('more_link'),
                    "ua-help-identifier": context.getHelpKey("FIREWALL_POLICY_SCHEDULER_CREATING")
                },
                "add_remote_name_validation": "scheduler-name",
                "on_overlay": true,
                "sections": [
                    {
                        "section_id": "scheduler_summary",
                        "heading": context.getMessage('fw_scheduler_create_view_section_general'),
                        "elements": [
                             {
                                 "element_multiple_error": true,
                                 "id": "scheduler-name",
                                 "name": "name",
                                 "label": context.getMessage('name'),
                                 "value": "{{name}}",
                                 "field-help": {
                                     "content": context.getMessage("fw_scheduler_create_name_tooltip")
                                 },
                                 "required": true,
                                 "error": true,
                                 "pattern-error": [
                                     {
                                         "pattern": "validtext",
                                         "error": context.getMessage('name_require_error')
                                     },
                                     {
                                         "regexId": "regex1",
                                         "pattern": "^[a-zA-Z0-9][a-zA-Z0-9\-_]{0,62}$",
                                         "error": context.getMessage('scheduler_name_error')
                                     }
                                 ]
                             },
                             {
                                 "element_textarea": true,
                                 "id": "description",
                                 "name": "description",
                                 "label": context.getMessage('description'),
                                 "max_length": DESCRIPTION_MAX_LENGTH,
                                 "post_validation": "descriptionValidator",
                                 "field-help": {
                                     "content": context.getMessage("fw_scheduler_create_description_tooltip")
                                 },
                                 "value": "{{description}}"
                             }
                         ]
                    },
                    {
                        "section_id": "scheduler_dates",
                        "heading": context.getMessage('fw_scheduler_create_view_section_dates'),
                        "elements": [
                            {
                                "label": context.getMessage("fw_scheduler_dates_type"),
                                "element_radio": true,
                                "field-help": {
                                    "content": context.getMessage('fw_scheduler_dates_type_tooltip')
                                },
                                "values": [
                                    {
                                        "label": context.getMessage("fw_scheduler_dates_type_forever"),
                                        "id": "date-forever",
                                        "name": "date-range-type",
                                        "value": "forever",
                                        "checked": true
                                    },
                                    {
                                        "label": context.getMessage("fw_scheduler_dates_type_range"),
                                        "id": "date-range",
                                        "name": "date-range-type",
                                        "value": "daterange"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "section_id": "scheduler_date_range",
                        "elements": [
                            {
                                "element_dateTimeWidget": true,
                                "label": context.getMessage('scheduler_grid_column_start_date'),
                                "value": "{{start-date1}}",
                                "post_validation": "checkRequired",
                                "datePickerWidget": {
                                    "id": "start-date1",
                                    "name": "start-date1",
                                    "placeholder": DATE_FORMAT,
                                    "dateFormat": DATE_FORMAT,
                                    "pattern-error": [
                                        {
                                            "pattern": "date",
                                            "error": context.getMessage('scheduler_error_date')
                                        },
                                        {
                                            "pattern": "length",
                                            "min_length":"10",
                                            "max_length":"10",
                                            "error": context.getMessage('scheduler_error_date')
                                        },
                                        {
                                            "pattern": "afterdate",
                                            "error": context.getMessage('scheduler_error_date_after', [afterDate])
                                        }
                                    ],
                                    "error": true,
                                    "notshowvalid": true
                                },
                                "timeWidget":{
                                    "id": "start-date1-time",
                                    "name": "start-date1-time"
                                }
                            },
                            {
                                "element_dateTimeWidget": true,
                                "label": context.getMessage('scheduler_grid_column_stop_date'),
                                "value": "{{stop-date1}}",
                                "post_validation": "checkRequired",
                                "datePickerWidget": {
                                    "id": "stop-date1",
                                    "name": "stop-date1",
                                    "placeholder": DATE_FORMAT,
                                    "dateFormat": DATE_FORMAT,
                                    "pattern-error": [
                                        {
                                            "pattern": "date",
                                            "error": context.getMessage('scheduler_error_date')
                                        },
                                        {
                                            "pattern": "afterdate",
                                            "error": context.getMessage('scheduler_error_date_after', [afterDate])
                                        },
                                        {
                                            "pattern": "length",
                                            "min_length":"10",
                                            "max_length":"10",
                                            "error": context.getMessage('scheduler_error_date')
                                        }
                                    ],
                                    "error": true,
                                    "notshowvalid": true
                                },
                                "timeWidget":{
                                    "id": "stop-date1-time",
                                    "name": "stop-date1-time"
                                }
                            },
                            {
                                "element_text": true,
                                "id": "separate_line"
                            },
                            {
                                "element_dateTimeWidget": true,
                                "label": context.getMessage('scheduler_grid_column_start_date_2'),
                                "value": "{{start-date2}}",
                                "datePickerWidget": {
                                    "id": "start-date2",
                                    "name": "start-date2",
                                    "placeholder": DATE_FORMAT,
                                    "dateFormat": DATE_FORMAT,
                                    "pattern-error": [
                                        {
                                            "pattern": "date",
                                            "error": context.getMessage('scheduler_error_date')
                                        },
                                        {
                                            "pattern": "afterdate",
                                            "error": context.getMessage('scheduler_error_date_after', [afterDate])
                                        },
                                        {
                                            "pattern": "length",
                                            "min_length":"10",
                                            "max_length":"10",
                                            "error": context.getMessage('scheduler_error_date')
                                        }
                                    ],
                                    "error": true,
                                    "notshowvalid": true
                                },
                                "timeWidget":{
                                    "id": "start-date2-time",
                                    "name": "start-date2-time"
                                }
                            },
                            {
                                "element_dateTimeWidget": true,
                                "label": context.getMessage('scheduler_grid_column_stop_date_2'),
                                "value": "{{stop-date2}}",
                                "datePickerWidget": {
                                    "id": "stop-date2",
                                    "name": "stop-date2",
                                    "placeholder": DATE_FORMAT,
                                    "dateFormat": DATE_FORMAT,
                                    "pattern-error": [
                                        {
                                            "pattern": "date",
                                            "error": context.getMessage('scheduler_error_date')
                                        },
                                        {
                                            "pattern": "afterdate",
                                            "error": context.getMessage('scheduler_error_date_after', [afterDate])
                                        },
                                        {
                                            "pattern": "length",
                                            "min_length":"10",
                                            "max_length":"10",
                                            "error": context.getMessage('scheduler_error_date')
                                        }
                                    ],
                                    "error": true,
                                    "notshowvalid": true
                                },
                                "timeWidget":{
                                    "id": "stop-date2-time",
                                    "name": "stop-date2-time"
                                }
                            }
                        ]
                    },
                    {
                        "section_id": "scheduler_times_range",
                        "heading": context.getMessage('fw_scheduler_create_view_section_times'),
                        "elements": [
                            {
                                "element_checkbox": true,
                                "label": context.getMessage('fw_scheduler_times_ranges'),
                                "field-help": {
                                    "content": context.getMessage("fw_scheduler_create_timerange_tooltip")
                                },
                                "values": [
                                    {
                                        "id": "time-range-specify",
                                        "name": "time-range-specify",
                                        "label": context.getMessage('fw_scheduler_times_type_specify'),
                                        "value": "enable"
                                    }
                                ]
                             }
                         ]
                    },
                    {
                        "section_id": "scheduler_times",
                        "elements": [
                            {
                                "element_description": true,
                                "id": "scheduler-daily-options",
                                "name": "scheduler_daily_options",
                                "label": context.getMessage('fw_scheduler_times_range_daily'),
                                "value": context.getMessage('fw_scheduler_times_range_daily_value'),
                                "inlineLinks":[{
                                    "id": "apply_to_all_days",
                                    "class": "show_overlay",
                                    "value": context.getMessage('fw_scheduler_times_range_apply_to_all')
                                }]
                            },
                            {
                                "element_description": true,
                                "id": "scheduler-weekly-days-placeholder"
                            }
                        ]
                    }
                ],
                "buttonsAlignedRight": true,
                "cancel_link": {
                    "id": "scheduler-cancel",
                    "value": context.getMessage('cancel')
                },
                "buttons": [
                    {
                        "id": "scheduler-save",
                        "name": "save",
                        "value": context.getMessage('ok')
                    }
                ]
            };
        };
    };
    return Configuration;
});