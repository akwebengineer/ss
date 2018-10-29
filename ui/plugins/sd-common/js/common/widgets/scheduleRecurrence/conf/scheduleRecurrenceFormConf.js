/**
 * A configuration object with the parameters required to build
 * a form for scheduleRecurrence
 *
 * @module scheduleRecurrenceFormConf
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
], function () {
    var DATE_FORMAT_LABEL = 'MM-DD-YYYY',
    DATE_FORMAT = 'MM-DD-YYYY',
    REPEAT_INTERVAL_MIN = 1,
    REPEAT_INTERVAL_MAX = 999999999999999,
    SCHEDULE_TYPE_NOW = 'now',
    SCHEDULE_TYPE_LATER = 'later',
    SCHEDULE_TYPE_REMOVE = 'remove',
    REPEAT_TYPE_NEVER = 'never',
    REPEAT_TYPE_ON = 'on';

    var Configuration = function(context) {

        this.getValues = function() {

            return {
                "form_id": "signature-database-config-form",
                "form_name": "signature-database-config-form",
                "sections": [
                    {
                        "section_id": "signature-database-config-schedule",
                        "elements": [
                            {
                                "element_radio": true,
                                "id": "signature-database-config-schedule_radio_field",
                                "label": context.getMessage('signature_database_download_schedule_type'),
                                "required": true,
                                "field-help": {
                                    "content": context.getMessage('signature_database_download_schedule_type_tooltip')
                                },
                                "values": [
                                   {
                                        "id": "signature-database-config-schedule-run-now",
                                        "name": "schedule-type",
                                        "label": context.getMessage('signature_database_download_schedule_type_run_now'),
                                        "checked": true,
                                        "value": SCHEDULE_TYPE_NOW
                                    },{
                                        "id": "signature-database-config-remove-schedule",
                                        "name": "schedule-type",
                                        "label": context.getMessage('signature_database_install_schedule_label_remove'),
                                        "value": SCHEDULE_TYPE_REMOVE
                                    },
                                    {
                                        "id": "signature-database-config-schedule-later",
                                        "name": "schedule-type",
                                        "label": context.getMessage('signature_database_install_schedule_label'),
                                        "value": SCHEDULE_TYPE_LATER
                                    }
                                ],
                                "error": context.getMessage('error_make_selection')
                            },
                            {
                                "element_dateTimeWidget": true,
                                "label": '',
                                "datePickerWidget": {
                                    "id": "signature-database-config-schedule-date",
                                    "name": "signature-database-config-schedule-date",
                                    "placeholder": DATE_FORMAT_LABEL,
                                    "dateFormat": DATE_FORMAT,
                                    "pattern-error": [
                                        {
                                            "pattern": "length",
                                            "min_length":"10",
                                            "max_length":"10",
                                            "error": context.getMessage('incomplete_date', [DATE_FORMAT_LABEL])
                                        },
                                        {
                                            "pattern": "date",
                                            "error": context.getMessage('date_format_error', [DATE_FORMAT_LABEL])
                                        },
                                        {
                                            "pattern": "validtext",
                                            "error": context.getMessage('require_error')
                                        }
                                    ],
                                    "error": true,
                                    "notshowvalid": true
                                },
                                "timeWidget":{
                                    "id": "signature-database-config-schedule-time",
                                    "name": "signature-database-config-schedule-time"
                                }
                            }
                        ]
                    },
                    {
                        "section_id": "signature-database-config-repeat",
                        "progressive_disclosure": "expanded",
                        "toggle_section":{
                            "label": context.getMessage('signature_database_install_repeat_label'),
                            "status": "hide"
                        },
                        "elements": [
                            {
                                "element_dropdown": true,
                                "id": "signature-database-repeat-unit",
                                "name": "signature-database-repeat-unit",
                                "label": context.getMessage('signature_database_install_repeat_unit_label'),
                                "values": [
                                    {
                                        "label": context.getMessage('signature_database_install_repeat_unit_minutes'),
                                        "value": "Minutes"
                                    },
                                    {
                                        "label": context.getMessage('signature_database_install_repeat_unit_hourly'),
                                        "value": "Hours"
                                    },
                                    {
                                        "label": context.getMessage('signature_database_install_repeat_unit_daily'),
                                        "selected": true,
                                        "value": "Days"
                                    },
                                    {
                                        "label": context.getMessage('signature_database_install_repeat_unit_weekly'),
                                        "value": "Weeks"
                                    },
                                    {
                                        "label": context.getMessage('signature_database_install_repeat_unit_monthly'),
                                        "value": "Months"
                                    },
                                    {
                                        "label": context.getMessage('signature_database_install_repeat_unit_yearly'),
                                        "value": "Years"
                                    }
                                ]
                            },
                            {
                                "element_number": true,
                                "id": "signature-database-repeat-interval",
                                "name": "interval",
                                "value": 1,
                                "min_value": REPEAT_INTERVAL_MIN,
                                "max_value": REPEAT_INTERVAL_MAX,
                                "label": context.getMessage('signature_database_install_repeat_interval_label'),
                                "error": context.getMessage('signature_database_install_repeat_interval_error', [REPEAT_INTERVAL_MIN, REPEAT_INTERVAL_MAX])
                            },
                            {
                                "element_radio": true,
                                "id": "signature-database-config-repeat-ends",
                                "label": context.getMessage('signature_database_install_repeat_end_label'),
                                "values": [
                                   {
                                        "id": "signature-database-config-repeat-never",
                                        "name": "repeat-type",
                                        "label": context.getMessage('signature_database_install_repeat_end_never'),
                                        "checked": true,
                                        "value": REPEAT_TYPE_NEVER
                                    },
                                    {
                                        "id": "signature-database-config-repeat-on",
                                        "name": "repeat-type",
                                        "label": context.getMessage('signature_database_install_repeat_end_on'),
                                        "value": REPEAT_TYPE_ON
                                    }
                                ]
                            },
                            {
                                "element_dateTimeWidget": true,
                                "label": '',
                                "datePickerWidget": {
                                    "id": "signature-database-repeat-endtime-date",
                                    "name": "signature-database-repeat-endtime-date",
                                    "placeholder": DATE_FORMAT_LABEL,
                                    "dateFormat": DATE_FORMAT,
                                    "pattern-error": [
                                        {
                                            "pattern": "length",
                                            "min_length":"10",
                                            "max_length":"10",
                                            "error": context.getMessage('incomplete_date', [DATE_FORMAT_LABEL])
                                        },
                                        {
                                            "pattern": "date",
                                            "error": context.getMessage('date_format_error', [DATE_FORMAT_LABEL])
                                        },
                                        {
                                            "pattern": "validtext",
                                            "error": context.getMessage('require_error')
                                        }
                                    ],
                                    "error": true,
                                    "notshowvalid": true
                                },
                                "timeWidget":{
                                    "id": "signature-database-repeat-endtime-time",
                                    "name": "signature-database-repeat-endtime-time"
                                }
                            },
                            {
                                "element_description": true,
                                "id": "signature-database-repeat-summary",
                                "label": context.getMessage('signature_database_install_repeat_summary'),
                                "value": ""
                            }
                        ]
                    }
                ]
            };
        };
    };

    return Configuration;
});
